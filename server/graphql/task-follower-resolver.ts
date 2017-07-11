import { ITaskEdges, ITaskFollowInput, ITaskNode } from 'schema';
import { IPaginationOptions } from '../db';
import Task from '../models/task';
import TaskFollower from '../models/task-follower';
import accessControls from './shared/access-controls';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskFollowersOptions {
  input: ITaskFollowInput;
}

export async function taskUserFollow(
  source: any, { input }: ITaskFollowersOptions, context: IContext,
): Promise<Task> {
  const { userRole } = context;
  const { userId, taskId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');

  return await TaskFollower.followTask({ userId, taskId });
}

export async function taskUserUnfollow(
  source: any, { input }: ITaskFollowersOptions, context: IContext,
): Promise<Task> {
  const { userRole } = context;
  const { userId, taskId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');

  return await TaskFollower.unfollowTask({ userId, taskId });
}

export async function resolveCurrentUserTasks(
  root: any, args: IPaginationOptions, { db, userRole, userId }: IContext,
): Promise<ITaskEdges> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const tasks = await Task.getUserTasks(userId, { pageNumber, pageSize });
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
