import { ITaskCreateInput, ITaskEdges, ITaskEditInput, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task, { TaskOrderOptions } from '../models/task';
import TaskEvent from '../models/task-event';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

export interface ITaskCreateArgs {
  input: ITaskCreateInput;
}

export interface IResolveTaskOptions {
  taskId: string;
}

export interface IDeleteTaskInput {
  taskId: string;
}

export interface IEditTaskOptions {
  input: ITaskEditInput;
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

export interface IResolveUrgentTasksForPatientOptions {
  patientId: string;
}

export async function taskCreate(root: any, { input }: ITaskCreateArgs, context: IContext) {
  const { userRole, userId, txn } = context;
  const {
    title,
    description,
    dueAt,
    patientId,
    assignedToId,
    patientGoalId,
    priority,
    CBOReferralId,
  } = input;
  await accessControls.isAllowed(userRole, 'create', 'task');
  checkUserLoggedIn(userId);

  // TODO: once we allow adding followers on create, create the associated TaskEvent records
  const task = await Task.create(
    {
      createdById: userId!,
      title,
      description: description || undefined,
      dueAt: dueAt || undefined,
      patientId,
      priority: priority || undefined,
      assignedToId: assignedToId || undefined,
      patientGoalId: patientGoalId || undefined,
      CBOReferralId,
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
}

export async function resolveTask(
  root: any,
  args: IResolveTaskOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'task');
  return Task.get(args.taskId, txn);
}

export async function taskEdit(root: any, args: IEditTaskOptions, context: IContext) {
  const { userId, userRole, txn } = context;
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

  const task = await Task.get(args.input.taskId, txn);
  const { priority, dueAt, assignedToId, title, description } = task;
  // TODO: fix typings here
  const updatedTask = await Task.update(args.input.taskId, args.input as any, txn);

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
    await TaskEvent.create(
      {
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'edit_title',
      },
      txn,
    );
  }

  if (args.input.description && args.input.description !== description) {
    await TaskEvent.create(
      {
        taskId: args.input.taskId,
        userId: userId!,
        eventType: 'edit_description',
      },
      txn,
    );
  }

  return updatedTask;
}

export async function taskDelete(root: any, args: IDeleteTaskOptions, context: IContext) {
  const { userId, userRole, txn } = context;
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

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
}

export async function taskComplete(root: any, args: IEditTaskOptions, context: IContext) {
  const { userId, userRole, txn } = context;
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

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
}

export async function taskUncomplete(root: any, args: IEditTaskOptions, context: IContext) {
  const { userId, userRole, txn } = context;
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);
  checkUserLoggedIn(userId);

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
}

export async function resolvePatientTasks(
  root: any,
  args: IPatientTasksFilterOptions,
  { db, userRole, txn }: IContext,
): Promise<ITaskEdges> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;
  const { order, orderBy } = formatOrderOptions<TaskOrderOptions>(args.orderBy, {
    order: 'asc',
    orderBy: 'dueAt',
  });

  const tasks = await Task.getPatientTasks(
    args.patientId,
    {
      pageNumber,
      pageSize,
      order,
      orderBy,
    },
    txn,
  );
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

export async function resolveTasksDueSoonForPatient(
  root: any,
  { patientId }: IResolveUrgentTasksForPatientOptions,
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  return Task.getTasksDueSoonForPatient(patientId, userId!, txn);
}

export async function resolveTasksWithNotificationsForPatient(
  root: any,
  { patientId }: IResolveUrgentTasksForPatientOptions,
  { userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  return Task.getTasksWithNotificationsForPatient(patientId, userId!, txn);
}

export async function resolveTaskIdsWithNotifications(
  root: any,
  args: any,
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');
  checkUserLoggedIn(userId);

  return Task.getTaskIdsWithNotifications(userId!, txn);
}
