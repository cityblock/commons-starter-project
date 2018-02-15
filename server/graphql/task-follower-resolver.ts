import { IRootMutationType, IRootQueryType, ITaskFollowInput, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task, { TaskOrderOptions } from '../models/task';
import TaskEvent from '../models/task-event';
import TaskFollower from '../models/task-follower';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { formatOrderOptions, formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskFollowersOptions {
  input: ITaskFollowInput;
}

export async function taskUserFollow(
  source: any,
  { input }: ITaskFollowersOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskUserFollow']> {
  const { taskId } = input;
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, taskId);

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

  return Task.get(taskId, txn);
}

export async function taskUserUnfollow(
  source: any,
  { input }: ITaskFollowersOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskUserUnfollow']> {
  const { taskId } = input;
  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, taskId);

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

  return Task.get(taskId, txn);
}

export interface ICurrentUserTasksFilterOptions extends IPaginationOptions {
  userId: string;
  orderBy: string;
}

/* tslint:disable:check-is-allowed */
export async function resolveCurrentUserTasks(
  root: any,
  args: ICurrentUserTasksFilterOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['tasksForCurrentUser']> {
  checkLoggedInWithPermissions(userId, permissions);

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
/* tslint:enable:check-is-allowed */
