import {
  IRootMutationType,
  IRootQueryType,
  ITaskCommentCreateInput,
  ITaskCommentDeleteInput,
  ITaskCommentEditInput,
  ITaskCommentNode,
} from 'schema';
import { IPaginationOptions } from '../db';
import TaskComment from '../models/task-comment';
import TaskEvent from '../models/task-event';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskCommentCreateOptions {
  input: ITaskCommentCreateInput;
}

export async function taskCommentCreate(
  source: any,
  { input }: ITaskCommentCreateOptions,
  context: IContext,
): Promise<IRootMutationType['taskCommentCreate']> {
  const { taskId, body } = input;
  const { userId, userRole, txn } = context;

  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  const taskComment = await TaskComment.create({ userId: userId!, taskId, body }, txn);

  await TaskEvent.create(
    {
      taskId,
      userId: userId!,
      eventType: 'add_comment',
      eventCommentId: taskComment.id,
    },
    txn,
  );

  return taskComment;
}

export interface ITaskCommentEditOptions {
  input: ITaskCommentEditInput;
}

export async function taskCommentEdit(
  source: any,
  { input }: ITaskCommentEditOptions,
  context: IContext,
): Promise<IRootMutationType['taskCommentEdit']> {
  const { userRole, userId, txn } = context;
  const { taskCommentId, body } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  const taskComment = await TaskComment.update(taskCommentId, body, txn);

  await TaskEvent.create(
    {
      taskId: taskComment.taskId,
      userId: userId!,
      eventType: 'edit_comment',
      eventCommentId: taskComment.id,
    },
    txn,
  );

  return taskComment;
}

export interface ITaskCommentDeleteOptions {
  input: ITaskCommentDeleteInput;
}

export async function taskCommentDelete(
  source: any,
  { input }: ITaskCommentDeleteOptions,
  context: IContext,
): Promise<IRootMutationType['taskCommentDelete']> {
  const { userRole, userId, txn } = context;
  const { taskCommentId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  const taskComment = await TaskComment.delete(taskCommentId, txn);

  await TaskEvent.create(
    {
      taskId: taskComment.taskId,
      userId: userId!,
      eventType: 'delete_comment',
      eventCommentId: taskComment.id,
    },
    txn,
  );

  return taskComment;
}

export async function resolveTaskComments(
  root: any,
  args: IPaginationOptions & { taskId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['taskComments']> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

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
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['taskComment']> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  return TaskComment.get(args.taskCommentId, txn);
}
