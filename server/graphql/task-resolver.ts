import { ITaskCreateInput, ITaskEdges, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task, { TaskOrderOptions } from '../models/task';
import accessControls from './shared/access-controls';
import { formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

export interface ITaskCreateArgs {
  input: ITaskCreateInput;
}

export interface IResolveTaskOptions {
  taskId: string;
}

export interface IEditTaskInput {
  taskId: string;
  title: string;
  description: string;
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
  const { title, description, dueAt, patientId, assignedToId } = input;
  await accessControls.isAllowed(userRole, 'create', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  return await Task.create({
    createdById: userId,
    title,
    description: description || undefined,
    dueAt: dueAt || undefined,
    patientId,
    assignedToId: assignedToId || undefined,
  });
}

export async function resolveTask(
  root: any, args: IResolveTaskOptions, { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'task');

  return await Task.get(args.taskId);
}

export async function taskEdit(
  root: any, args: IEditTaskOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);

  return await Task.update(args.input.taskId, args.input);
}

export async function taskDelete(
  root: any, args: IDeleteTaskOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);

  return await Task.delete(args.input.taskId);
}

export async function taskComplete(
  root: any, args: IEditTaskOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);

  if (!userId) {
    throw new Error('please log in');
  }

  return await Task.complete(args.input.taskId, userId);
}

export async function taskUncomplete(
  root: any, args: IEditTaskOptions, { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'task', args.input.taskId, userId);

  if (!userId) {
    throw new Error('please log in');
  }

  return await Task.uncomplete(args.input.taskId, userId);
}

export async function resolvePatientTasks(
  root: any, args: IPatientTasksFilterOptions, { db, userRole }: IContext,
): Promise<ITaskEdges> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;
  const { order, orderBy } = formatOrderOptions<TaskOrderOptions>(
    args.orderBy, { order: 'asc', orderBy: 'dueAt' },
  );

  const tasks = await Task.getPatientTasks(
    args.patientId,
    { pageNumber, pageSize, order, orderBy },
  );
  const taskEdges = tasks.results.map((task: Task) => formatRelayEdge(task, task.id) as ITaskNode);

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < tasks.total;

  return {
    edges: taskEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}
