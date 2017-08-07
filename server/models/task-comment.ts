import { transaction, Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Task from './task';
import User from './user';

export interface ITaskCommentOptions {
  userId: string;
  taskId: string;
  body: string;
}

// TODO: Only fetch needed eager models
const EAGER_QUERY = '[user]';

/* tslint:disable:member-ordering */
export default class TaskComment extends Model {
  id: string;
  body: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
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
      taskId: { type: 'string' },
      userId: { type: 'string' },
      body: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(taskCommentId: string): Promise<TaskComment> {
    const taskComment = await this.query()
      .eager(EAGER_QUERY)
      .findById(taskCommentId);
    if (!taskComment) {
      return Promise.reject(`No such taskComment: ${taskCommentId}`);
    }
    return taskComment;
  }

  static async create(
    { userId, taskId, body }: ITaskCommentOptions,
    txn?: Transaction,
  ): Promise<TaskComment> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insert({ taskId, userId, body });
  }

  static async update(
    taskCommentId: string, body: string, txn?: Transaction,
  ): Promise<TaskComment> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .updateAndFetchById(taskCommentId, { body });
  }

  static async delete(taskCommentId: string, txn?: Transaction): Promise<TaskComment> {
    return await this.query(txn)
      .updateAndFetchById(taskCommentId, {
        deletedAt: new Date().toISOString(),
      });
  }

  static async getTaskComments(
    taskId: string,
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<TaskComment>> {
    const patientsResult = await this
      .query()
      .where({ taskId, deletedAt: null })
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async execWithTransaction(
    callback: (boundModelClass: typeof TaskComment) => Promise<TaskComment>,
  ) {
    return await transaction(this as any, callback);
  }
}
/* tslint:disable:member-ordering */
