import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Task from './task';
import User from './user';

interface ITaskFollowerOptions {
  userId: string;
  taskId: string;
}

interface ITaskUnfollowPatientTasksOptions {
  userId: string;
  patientId: string;
  newFollowerId?: string;
}

/* tslint:disable:member-ordering */
export default class TaskFollower extends BaseModel {
  task: Task;
  taskId: string;
  user: User;
  userId: string;

  static tableName = 'task_follower';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['taskId', 'userId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'task_follower.userId',
          to: 'user.id',
        },
      },

      task: {
        relation: Model.BelongsToOneRelation,
        modelClass: Task,
        join: {
          from: 'task_follower.taskId',
          to: 'task.id',
        },
      },
    };
  }

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

  static async unfollowPatientTasks(
    { userId, patientId, newFollowerId }: ITaskUnfollowPatientTasksOptions,
    txn: Transaction,
  ): Promise<number> {
    // Get list of tasks that are being followed by the given user for the given patient
    const originalUserFollowedTasks = await this.query(txn)
      .joinRelation('task')
      .where('task.patientId', patientId)
      .andWhere('task_follower.userId', userId)
      .andWhere('task_follower.deletedAt', null)
      .select('task_follower.taskId');
    const originalUserFollowedTaskIds = originalUserFollowedTasks.map(
      (taskFollower: any) => taskFollower.taskId,
    );

    // Unfollow tasks
    const unfollowedTasks = await this.query(txn)
      .where('taskId', 'in', originalUserFollowedTaskIds)
      .andWhere({ userId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    // Follow tasks if there is a newFollowerId
    if (newFollowerId) {
      const newUserAlreadyFollowedTaskIds = this.query(txn)
        .where('taskId', 'in', originalUserFollowedTaskIds)
        .andWhere('userId', newFollowerId)
        .andWhere({ deletedAt: null })
        .select('taskId');
      const tasksToFollow = await Task.query(txn)
        .where('id', 'in', originalUserFollowedTaskIds)
        .andWhere('id', 'not in', newUserAlreadyFollowedTaskIds)
        .select('id');

      const insertObjects = tasksToFollow.map(task => ({ taskId: task.id, userId: newFollowerId }));

      await this.query(txn).insertGraph(insertObjects);
    }

    return unfollowedTasks;
  }
}
/* tslint:enable:member-ordering */
