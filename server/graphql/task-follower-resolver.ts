import { ITaskEdges, ITaskFollowInput, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task, { TaskOrderOptions } from '../models/task';
import TaskEvent from '../models/task-event';
import TaskFollower from '../models/task-follower';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskFollowersOptions {
  input: ITaskFollowInput;
}

export async function taskUserFollow(
  source: any,
  { input }: ITaskFollowersOptions,
  context: IContext,
): Promise<Task> {
  const { userRole, userId, txn } = context;
  const { taskId } = input;

  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  await TaskFollower.followTask(
    {
      userId: input.userId,
      taskId,
    },
    txn,
  );

  await TaskEvent.create(
    {
      taskId,
      userId: userId!,
      eventType: 'add_follower',
      eventUserId: input.userId,
    },
    txn,
  );

  return await Task.get(taskId, txn);
}

export async function taskUserUnfollow(
  source: any,
  { input }: ITaskFollowersOptions,
  context: IContext,
): Promise<Task> {
  const { userRole, userId, txn } = context;
  const { taskId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  await TaskFollower.unfollowTask(
    {
      userId: input.userId,
      taskId,
    },
    txn,
  );

  await TaskEvent.create(
    {
      taskId,
      userId: userId!,
      eventType: 'remove_follower',
      eventUserId: input.userId,
    },
    txn,
  );

  return await Task.get(taskId, txn);
}

export interface ICurrentUserTasksFilterOptions extends IPaginationOptions {
  userId: string;
  orderBy: string;
}

export async function resolveCurrentUserTasks(
  root: any,
  args: ICurrentUserTasksFilterOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<ITaskEdges> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;
  const { order, orderBy } = formatOrderOptions<TaskOrderOptions>(args.orderBy, {
    order: 'asc',
    orderBy: 'dueAt',
  });

  const tasks = await Task.getUserTasks(
    userId!,
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
