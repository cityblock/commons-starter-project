import {
  IRootMutationType,
  IRootQueryType,
  ITaskCreateInput,
  ITaskEditInput,
  ITaskNode,
} from 'schema';
import { IPaginationOptions } from '../db';
import Task, { TaskOrderOptions } from '../models/task';
import TaskEvent from '../models/task-event';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

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

export interface IResolveTasksForUserForPatientOptions {
  userId: string;
  patientId: string;
}

export async function taskCreate(
  root: any,
  { input }: ITaskCreateArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskCreate']> {
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

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

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
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['task']> {
  await checkUserPermissions(userId, permissions, 'view', 'task', txn, args.taskId);

  return Task.get(args.taskId, txn);
}

export async function taskEdit(
  root: any,
  args: IEditTaskOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, args.input.taskId);

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

export async function taskDelete(
  root: any,
  args: IDeleteTaskOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'task', txn, args.input.taskId);

  const task = await Task.delete(args.input.taskId, txn);

  await TaskEvent.create(
    {
      taskId: args.input.taskId,
      userId: userId!,
      eventType: 'delete_task',
    },
    txn,
  );

  return task || null;
}

export async function taskComplete(
  root: any,
  args: IEditTaskOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskComplete']> {
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, args.input.taskId);

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

export async function taskUncomplete(
  root: any,
  args: IEditTaskOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskUncomplete']> {
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, args.input.taskId);

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
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['tasksForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

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

export async function resolveTasksForUserForPatient(
  root: any,
  args: IResolveTasksForUserForPatientOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['tasksForUserForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return Task.getAllUserPatientTasks({ userId: args.userId, patientId: args.patientId }, txn);
}

export async function resolveTasksDueSoonForPatient(
  root: any,
  { patientId }: IResolveUrgentTasksForPatientOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['tasksDueSoonForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  return Task.getTasksDueSoonForPatient(patientId, userId!, txn);
}

export async function resolveTasksWithNotificationsForPatient(
  root: any,
  { patientId }: IResolveUrgentTasksForPatientOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['tasksWithNotificationsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  return Task.getTasksWithNotificationsForPatient(patientId, userId!, txn);
}

/* tslint:disable:check-is-allowed */
export async function resolveTaskIdsWithNotifications(
  root: any,
  args: {},
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['taskIdsWithNotifications']> {
  checkLoggedInWithPermissions(userId, permissions);

  return Task.getTaskIdsWithNotifications(userId!, txn);
}
/* tslint:enable:check-is-allowed */
