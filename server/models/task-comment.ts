import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Task from './task';
import User from './user';

interface ITaskCommentOptions {
  userId: string;
  taskId: string;
  body: string;
}

// TODO: Only fetch needed eager models
const EAGER_QUERY = '[user]';

/* tslint:disable:member-ordering */
export default class TaskComment extends BaseModel {
  body: string;
  task: Task;
  taskId: string;
  user: User;
  userId: string;

  static tableName = 'task_comment';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string', minLength: 1 },
      userId: { type: 'string', minLength: 1 },
      body: { type: 'string', minLength: 1 },
      deletedAt: { type: 'string' },
    },
    required: ['taskId', 'userId', 'body'],
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task_comment.userId',
        to: 'user.id',
      },
    },

    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'task',
      join: {
        from: 'task_comment.taskId',
        to: 'task.id',
      },
    },
  };

  static async get(taskCommentId: string, txn: Transaction): Promise<TaskComment> {
    const taskComment = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: taskCommentId, deletedAt: null });
    if (!taskComment) {
      return Promise.reject(`No such taskComment: ${taskCommentId}`);
    }
    return taskComment;
  }

  static async create(
    { userId, taskId, body }: ITaskCommentOptions,
    txn: Transaction,
  ): Promise<TaskComment> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insert({ taskId, userId, body });
  }

  static async update(taskCommentId: string, body: string, txn: Transaction): Promise<TaskComment> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .patchAndFetchById(taskCommentId, { body });
  }
  static async delete(taskCommentId: string, txn: Transaction): Promise<TaskComment> {
    await this.query(txn)
      .where({ id: taskCommentId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const taskComment = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(taskCommentId);
    if (!taskComment) {
      return Promise.reject(`No such taskComment: ${taskCommentId}`);
    }
    return taskComment;
  }

  static async getTaskComments(
    taskId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<TaskComment>> {
    const patientsResult = (await this.query(txn)
      .where({ taskId, deletedAt: null })
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }
}
/* tslint:enable:member-ordering */
