import { ITaskFollowInput, IUser } from 'schema';
import { convertUser } from '../graphql/shared/converter';
import TaskFollower from '../models/task-follower';
import User from '../models/user';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskFollowersOptions {
  input: ITaskFollowInput;
}

export async function taskUserFollow(
  source: any, { input }: ITaskFollowersOptions, context: IContext,
): Promise<User[]> {
  const { userRole } = context;
  const { userId, taskId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');

  return await TaskFollower.followTask({ userId, taskId });
}

export async function taskUserUnfollow(
  source: any, { input }: ITaskFollowersOptions, context: IContext,
): Promise<User[]> {
  const { userRole } = context;
  const { userId, taskId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');

  return await TaskFollower.unfollowTask({ userId, taskId });
}

export async function resolveTaskFollowers(
  root: any,
  { taskId }: IQuery,
  { userRole, userId }: IContext,
): Promise<IUser[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'task', taskId, userId);

  const users = await TaskFollower.getForTask(taskId);
  return users.map(convertUser);
}
