import { IRootMutationType, ITaskFollowInput } from 'schema';
import Task from '../models/task';
import TaskEvent from '../models/task-event';
import TaskFollower from '../models/task-follower';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
