import { transaction } from 'objection';
import { ITaskCreateInput, ITaskEdges, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task, { Priority, TaskOrderOptions } from '../models/task';
import TaskEvent from '../models/task-event';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

export interface ITaskCreateArgs {
  input: ITaskCreateInput;
}

export interface IResolveTaskOptions {
  taskId: string;
}

export interface IEditTaskInput {
  taskId: string;
  title?: string;
  description?: string;
  assignedToId?: string;
  dueAt?: string;
  priority?: Priority;
  patientGoalId?: string;
}

export interface IDeleteTaskInput {
  taskId: string;
}

export interface IEditTaskOptions {
  input: IEditTaskInput;
}

export interface IDeleteTaskOptions {
  input: IDeleteTaskInput;
}

export interface IPatientTasksFilterOptions extends IPaginationOptions {
  patientId: string;
  orderBy: string;
}

export interface IUserTasksFilterOptions extends IPaginationOptions {
  userId: string;
}

export async function taskCreate(root: any, { input }: ITaskCreateArgs, context: IContext) {
  const { userRole, userId } = context;
  const { title, description, dueAt, patientId, assignedToId, patientGoalId } = input;
  await accessControls.isAllowed(userRole, 'create', 'task');
  checkUserLoggedIn(userId);

  // TODO: once we allow adding followers on create, create the associated TaskEvent records
  return await transaction(Task.knex(), async txn => {
    const task = await Task.create(
      {
        createdById: userId!,
        title,
        description: description || undefined,
        dueAt: dueAt || undefined,
        patientId,
        assignedToId: assignedToId || undefined,
        patientGoalId: patientGoalId || undefined,
      },
      txn,
    );

    await TaskEvent.create(
      {
        taskId: task.id,
        userId: userId!,
        eventType: 'create_task',
      },
      txn,
    );

    if (assignedToId) {
      await TaskEvent.create(
        {
          taskId: task.id,
          userId: userId!,
          eventType: 'edit_assignee',
          eventUserId: assignedToId,
        },
        txn,
      );
    }

    return task;
  });
}

export async function resolveTask(
  root: any,
  args: IResolveTaskOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'task');
  return await Task.get(args.taskId);
}

export async function taskEdit(
  root: any,
  args: IEditTaskOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

  const task = await Task.get(args.input.taskId);

  return await transaction(Task.knex(), async txn => {
    const { priority, dueAt, assignedToId, title, description } = task;

    const updatedTask = await Task.update(args.input.taskId, args.input, txn);

    if (args.input.priority && args.input.priority !== priority) {
      await TaskEvent.create(
        {
          taskId: args.input.taskId,
          userId: userId!,
          eventType: 'edit_priority',
        },
        txn,
      );
    }

    if (args.input.dueAt && args.input.dueAt !== dueAt) {
      await TaskEvent.create(
        {
          taskId: args.input.taskId,
          userId: userId!,
          eventType: 'edit_due_date',
        },
        txn,
      );
    }

    if (args.input.assignedToId && args.input.assignedToId !== assignedToId) {
      await TaskEvent.create(
        {
          taskId: args.input.taskId,
          userId: userId!,
          eventType: 'edit_assignee',
          eventUserId: args.input.assignedToId,
        },
        txn,
      );
    }

    if (args.input.title && args.input.title !== title) {
      await TaskEvent.create({
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'edit_title',
      });
    }

    if (args.input.description && args.input.description !== description) {
      await TaskEvent.create({
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'edit_description',
      });
    }

    return updatedTask;
  });
}

export async function taskDelete(
  root: any,
  args: IDeleteTaskOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

  return await transaction(Task.knex(), async txn => {
    const task = await Task.delete(args.input.taskId, txn);

    await TaskEvent.create(
      {
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'delete_task',
      },
      txn,
    );

    return task;
  });
}

export async function taskComplete(
  root: any,
  args: IEditTaskOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

  return await transaction(Task.knex(), async txn => {
    const task = Task.complete(args.input.taskId, userId!, txn);

    await TaskEvent.create(
      {
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'complete_task',
      },
      txn,
    );

    return task;
  });
}

export async function taskUncomplete(
  root: any,
  args: IEditTaskOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

  return await transaction(Task.knex(), async txn => {
    const task = Task.uncomplete(args.input.taskId, userId!, txn);

    await TaskEvent.create(
      {
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'uncomplete_task',
      },
      txn,
    );

    return task;
  });
}

export async function resolvePatientTasks(
  root: any,
  args: IPatientTasksFilterOptions,
  { db, userRole }: IContext,
): Promise<ITaskEdges> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;
  const { order, orderBy } = formatOrderOptions<TaskOrderOptions>(args.orderBy, {
    order: 'asc',
    orderBy: 'dueAt',
  });

  const tasks = await Task.getPatientTasks(args.patientId, {
    pageNumber,
    pageSize,
    order,
    orderBy,
  });
  const taskEdges = tasks.results.map((task: Task) => formatRelayEdge(task, task.id) as ITaskNode);

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < tasks.total;

  return {
    edges: taskEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}
