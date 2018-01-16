import { transaction } from 'objection';
import {
  ITaskComment,
  ITaskCommentCreateInput,
  ITaskCommentDeleteInput,
  ITaskCommentEdges,
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
): Promise<TaskComment> {
  const { taskId, body } = input;
  const { userId, userRole } = context;
  const existingTxn = context.txn;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.create(
      { userId: userId!, taskId, body },
      existingTxn || txn,
    );

    await TaskEvent.create(
      {
        taskId,
        userId: userId!,
        eventType: 'add_comment',
        eventCommentId: taskComment.id,
      },
      existingTxn || txn,
    );

    return taskComment;
  });
}

export interface ITaskCommentEditOptions {
  input: ITaskCommentEditInput;
}

export async function taskCommentEdit(
  source: any,
  { input }: ITaskCommentEditOptions,
  context: IContext,
): Promise<TaskComment> {
  const { userRole, userId } = context;
  const existingTxn = context.txn;
  const { taskCommentId, body } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.update(taskCommentId, body, existingTxn || txn);

    await TaskEvent.create(
      {
        taskId: taskComment.taskId,
        userId: userId!,
        eventType: 'edit_comment',
        eventCommentId: taskComment.id,
      },
      existingTxn || txn,
    );

    return taskComment;
  });
}

export interface ITaskCommentDeleteOptions {
  input: ITaskCommentDeleteInput;
}

export async function taskCommentDelete(
  source: any,
  { input }: ITaskCommentDeleteOptions,
  context: IContext,
): Promise<TaskComment> {
  const { userRole, userId } = context;
  const existingTxn = context.txn;
  const { taskCommentId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  checkUserLoggedIn(userId);

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.delete(taskCommentId, existingTxn || txn);

    await TaskEvent.create(
      {
        taskId: taskComment.taskId,
        userId: userId!,
        eventType: 'delete_comment',
        eventCommentId: taskComment.id,
      },
      existingTxn || txn,
    );

    return taskComment;
  });
}

export async function resolveTaskComments(
  root: any,
  args: IPaginationOptions & { taskId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<ITaskCommentEdges> {
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
): Promise<ITaskComment> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  checkUserLoggedIn(userId);

  return await TaskComment.get(args.taskCommentId, txn);
}
