import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Task from './task';
import User from './user';

export interface ITaskFollowerOptions {
  userId: string;
  taskId: string;
}

/* tslint:disable:member-ordering */
export default class TaskFollower extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
  task: Task;
  taskId: string;
  user: User;
  userId: string;

  static tableName = 'task_follower';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string' },
      userId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async followTask(
    { userId, taskId }: ITaskFollowerOptions,
  ): Promise<Task> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(TaskFollower as any, async TaskFollowerWithTransaction => {
      const relations = await TaskFollowerWithTransaction
        .query()
        .where('taskId', taskId)
        .andWhere('userId', userId)
        .andWhere('deletedAt', null);

      if (relations.length < 1) {
        await TaskFollowerWithTransaction
          .query()
          .insert({ taskId, userId });
      }
    });

    return await Task.get(taskId);
  }

  static async unfollowTask(
    { userId, taskId }: ITaskFollowerOptions,
  ): Promise<Task> {
    await this.query()
      .where('userId', userId)
      .andWhere('taskId', taskId)
      .andWhere('deletedAt', null)
      .update({ deletedAt: new Date().toISOString() });
    return await Task.get(taskId);
  }

}
/* tslint:disable:member-ordering */
