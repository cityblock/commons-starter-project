import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Task from './task';
import User from './user';

interface ITaskFollowerOptions {
  userId: string;
  taskId: string;
}

/* tslint:disable:member-ordering */
export default class TaskFollower extends BaseModel {
  task: Task;
  taskId: string;
  user: User;
  userId: string;

  static tableName = 'task_follower';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
    },
    required: ['taskId', 'userId'],
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task_follower.userId',
        to: 'user.id',
      },
    },

    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'task',
      join: {
        from: 'task_follower.taskId',
        to: 'task.id',
      },
    },
  };

  static async followTask(
    { userId, taskId }: ITaskFollowerOptions,
    txn: Transaction,
  ): Promise<TaskFollower> {
    const relations = await TaskFollower.query(txn)
      .where('taskId', taskId)
      .andWhere('userId', userId)
      .andWhere('deletedAt', null);

    if (relations.length < 1) {
      return TaskFollower.query(txn).insert({ taskId, userId });
    } else {
      return relations[0];
    }
  }

  static async unfollowTask(
    { userId, taskId }: ITaskFollowerOptions,
    txn: Transaction,
  ): Promise<number> {
    return this.query(txn)
      .where('userId', userId)
      .andWhere('taskId', taskId)
      .andWhere('deletedAt', null)
      .patch({ deletedAt: new Date().toISOString() });
  }
}
/* tslint:enable:member-ordering */
