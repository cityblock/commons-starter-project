import {
  IRootMutationType,
  IRootQueryType,
  ITaskCommentCreateInput,
  ITaskCommentDeleteInput,
  ITaskCommentEditInput,
  ITaskCommentNode,
  TaskEventTypes,
} from 'schema';
import { IPaginationOptions } from '../db';
import { addJobToQueue } from '../helpers/queue-helpers';
import TaskComment from '../models/task-comment';
import checkUserPermissions from './shared/permissions-check';
import { formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskCommentCreateOptions {
  input: ITaskCommentCreateInput;
}

export async function taskCommentCreate(
  source: any,
  { input }: ITaskCommentCreateOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['taskCommentCreate']> {
  const { taskId, body } = input;

  await checkUserPermissions(userId, permissions, 'edit', 'task', txn, taskId);

  const taskComment = await TaskComment.create({ userId: userId!, taskId, body }, txn);

  addJobToQueue('taskEvent', {
    taskId,
    userId: userId!,
    eventType: 'add_comment' as TaskEventTypes,
    eventCommentId: taskComment.id,
  });

  return taskComment;
}

export interface ITaskCommentEditOptions {
  input: ITaskCommentEditInput;
}

export async function taskCommentEdit(
  source: any,
  { input }: ITaskCommentEditOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskCommentEdit']> {
  const { taskCommentId, body } = input;

  await checkUserPermissions(userId, permissions, 'edit', 'taskComment', txn, taskCommentId);

  const taskComment = await TaskComment.update(taskCommentId, body, txn);

  addJobToQueue('taskEvent', {
    taskId: taskComment.taskId,
    userId: userId!,
    eventType: 'edit_comment' as TaskEventTypes,
    eventCommentId: taskComment.id,
  });

  return taskComment;
}

export interface ITaskCommentDeleteOptions {
  input: ITaskCommentDeleteInput;
}

export async function taskCommentDelete(
  source: any,
  { input }: ITaskCommentDeleteOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['taskCommentDelete']> {
  const { taskCommentId } = input;
  await checkUserPermissions(userId, permissions, 'delete', 'taskComment', txn, taskCommentId);

  const taskComment = await TaskComment.delete(taskCommentId, txn);

  addJobToQueue('taskEvent', {
    taskId: taskComment.taskId,
    userId: userId!,
    eventType: 'delete_comment' as TaskEventTypes,
    eventCommentId: taskComment.id,
  });

  return taskComment;
}

export async function resolveTaskComments(
  root: any,
  args: IPaginationOptions & { taskId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['taskComments']> {
  await checkUserPermissions(userId, permissions, 'view', 'task', txn, args.taskId);

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const taskComments = await TaskComment.getTaskComments(
    args.taskId,
    {
      pageNumber,
      pageSize,
    },
    txn,
  );
  const taskCommentEdges = taskComments.results.map(
    (taskComment: TaskComment) => formatRelayEdge(taskComment, taskComment.id) as ITaskCommentNode,
  );

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = (pageNumber + 1) * pageSize < taskComments.total;

  return {
    edges: taskCommentEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}

export async function resolveTaskComment(
  rot: any,
  args: { taskCommentId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['taskComment']> {
  await checkUserPermissions(userId, permissions, 'view', 'taskComment', txn, args.taskCommentId);

  return TaskComment.get(args.taskCommentId, txn);
}
