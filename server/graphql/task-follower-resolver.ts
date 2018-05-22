import { transaction } from 'objection';
import { IRootMutationType, ITaskFollowInput, TaskEventTypes } from 'schema';
import { addJobToQueue } from '../helpers/queue-helpers';
import Task from '../models/task';
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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['taskUserFollow']> {
  const { taskId } = input;
  return transaction(testTransaction || TaskFollower.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'task', txn, taskId);

    await TaskFollower.followTask(
      {
        userId: input.userId,
        taskId,
      },
      txn,
    );

    addJobToQueue('taskEvent', {
      taskId,
      userId: userId!,
      eventType: 'add_follower' as TaskEventTypes,
      eventUserId: input.userId,
    });

    return Task.get(taskId, txn);
  });
}

export async function taskUserUnfollow(
  source: any,
  { input }: ITaskFollowersOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['taskUserUnfollow']> {
  const { taskId } = input;
  return transaction(testTransaction || TaskFollower.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'task', txn, taskId);

    await TaskFollower.unfollowTask(
      {
        userId: input.userId,
        taskId,
      },
      txn,
    );

    addJobToQueue('taskEvent', {
      taskId,
      userId: userId!,
      eventType: 'remove_follower' as TaskEventTypes,
      eventUserId: input.userId,
    });

    return Task.get(taskId, txn);
  });
}
