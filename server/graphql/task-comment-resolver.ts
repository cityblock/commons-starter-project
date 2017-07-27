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
import { formatRelayEdge, IContext } from './shared/utils';

export interface IQuery {
  taskId: string;
}

export interface ITaskCommentCreateOptions {
  input: ITaskCommentCreateInput;
}

export async function taskCommentCreate(
  source: any, { input }: ITaskCommentCreateOptions, { userId, userRole }: IContext,
): Promise<TaskComment> {
  const { taskId, body } = input;

  if (!userId) {
    throw new Error('not logged in');
  }
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.create({ userId, taskId, body }, txn);

    await TaskEvent.create({
      taskId,
      userId,
      eventType: 'add_comment',
      eventCommentId: taskComment.id,
    }, txn);

    return taskComment;
  });
}

export interface ITaskCommentEditOptions {
  input: ITaskCommentEditInput;
}

export async function taskCommentEdit(
  source: any, { input }: ITaskCommentEditOptions, context: IContext,
): Promise<TaskComment> {
  const { userRole, userId } = context;
  const { taskCommentId, body } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.update(taskCommentId, body, txn);

    await TaskEvent.create({
      taskId: taskComment.taskId,
      userId,
      eventType: 'edit_comment',
      eventCommentId: taskComment.id,
    }, txn);

    return taskComment;
  });
}

export interface ITaskCommentDeleteOptions {
  input: ITaskCommentDeleteInput;
}

export async function taskCommentDelete(
  source: any, { input }: ITaskCommentDeleteOptions, context: IContext,
): Promise<TaskComment> {
  const { userRole, userId } = context;
  const { taskCommentId } = input;
  // TODO: Improve access controls here. Requirements unclear ATM
  await accessControls.isAllowed(userRole, 'edit', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  return await transaction(TaskComment.knex() as any, async txn => {
    const taskComment = await TaskComment.delete(taskCommentId, txn);

    await TaskEvent.create({
      taskId: taskComment.taskId,
      userId,
      eventType: 'delete_comment',
      eventCommentId: taskComment.id,
    }, txn);

    return taskComment;
  });
}

export async function resolveTaskComments(
  root: any, args: IPaginationOptions & { taskId: string }, { db, userRole, userId }: IContext,
): Promise<ITaskCommentEdges> {
  // TODO: Improve task access controls
  await accessControls.isAllowed(userRole, 'view', 'task');
  if (!userId) {
    throw new Error('not logged in');
  }

  const pageNumber = args.pageNumber || 0;
  const pageSize = args.pageSize || 10;

  const taskComments = await TaskComment.getTaskComments(args.taskId, { pageNumber, pageSize });
  const taskCommentEdges = taskComments.results.map(
    (taskComment: TaskComment) => formatRelayEdge(taskComment, taskComment.id) as ITaskCommentNode);

  const hasPreviousPage = pageNumber !== 0;
  const hasNextPage = ((pageNumber + 1) * pageSize) < taskComments.total;

  return {
    edges: taskCommentEdges,
    pageInfo: {
      hasPreviousPage,
      hasNextPage,
    },
  };
}

export async function resolveTaskComment(
  rot: any, args: { taskCommentId: string }, { db, userRole, userId }: IContext,
): Promise<ITaskComment> {
  await accessControls.isAllowed(userRole, 'view', 'task');
  if (!userId) {
    throw new Error('not logged in!');
  }

  return await TaskComment.get(args.taskCommentId);
}
