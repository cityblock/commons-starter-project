import { uniq } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Task from './task';
import TaskEvent from './task-event';
import User from './user';

interface IEventNotificationOptions {
  userId: string;
  taskEventId?: string;
}

interface ICreateTaskNotificationsOptions {
  initiatingUserId: string;
  taskEventId: string;
  taskId: string;
}

const EAGER_QUERY = '[taskEvent.[user, eventComment, eventComment.user, eventUser, task], user]';

/* tslint:disable:member-ordering */
export default class EventNotification extends BaseModel {
  userId: string;
  user: User;
  taskEventId?: string;
  taskEvent?: TaskEvent;
  seenAt: string;
  emailSentAt: string;
  deliveredAt: string;

  static tableName = 'event_notification';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      taskEventId: { type: 'string' },
      seenAt: { type: 'string' },
      emailSentAt: { type: 'string' },
      deliveredAt: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['userId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'event_notification.userId',
          to: 'user.id',
        },
      },

      taskEvent: {
        relation: Model.BelongsToOneRelation,
        modelClass: TaskEvent,
        join: {
          from: 'event_notification.taskEventId',
          to: 'task_event.id',
        },
      },
    };
  }

  static async get(eventNotificationId: string, txn: Transaction): Promise<EventNotification> {
    const eventNotification = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .findById(eventNotificationId);
    if (!eventNotification) {
      return Promise.reject(`No such eventNotification: ${eventNotificationId}`);
    }
    return eventNotification;
  }

  static async create(
    { taskEventId, userId }: IEventNotificationOptions,
    txn: Transaction,
  ): Promise<EventNotification> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .insert({ taskEventId, userId });
  }

  static async createTaskNotifications(
    { initiatingUserId, taskEventId, taskId }: ICreateTaskNotificationsOptions,
    txn: Transaction,
  ) {
    const task = await Task.getIgnoreDeletedAt(taskId, txn);

    const interestedUserIds = task.followers.map((follower: User) => follower.id);
    if (task.assignedToId) {
      interestedUserIds.push(task.assignedToId);
    }
    const userIdsToNotify = uniq(interestedUserIds).filter(userId => userId !== initiatingUserId);

    const batchQueries = userIdsToNotify.map(userId => ({
      taskEventId,
      userId,
    }));

    const result = await this.query(txn).insertGraph(batchQueries);

    return result.length;
  }

  static async delete(eventNotificationId: string, txn: Transaction): Promise<EventNotification> {
    await this.query(txn)
      .where({ id: eventNotificationId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const eventNotification = await this.query(txn).findById(eventNotificationId);
    if (!eventNotification) {
      return Promise.reject(`No such eventNotification: ${eventNotificationId}`);
    }
    return eventNotification;
  }

  static async dismiss(eventNotificationId: string, txn: Transaction): Promise<EventNotification> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .patchAndFetchById(eventNotificationId, { seenAt: new Date().toISOString() });
  }

  static async dismissAllForUserTask(
    taskId: string,
    userId: string,
    txn: Transaction,
  ): Promise<EventNotification[]> {
    const taskEventIdsToDismissQuery = this.query(txn)
      .joinRelation('taskEvent')
      .where('taskEvent.taskId', taskId)
      .andWhere('event_notification.userId', userId)
      .andWhere('event_notification.seenAt', null)
      .select('event_notification.id');

    return (await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .where('id', 'in', taskEventIdsToDismissQuery as any)
      .patch({ seenAt: new Date().toISOString() })
      .returning('*')) as any;
  }

  // Fetch all event notifications for a user
  static async getUserEventNotifications(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query(txn)
      .where({ userId, deletedAt: null, seenAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: eventNotifications.results,
      total: eventNotifications.total,
    };
  }

  // Fetch all task-related event notifications for a user
  static async getUserTaskEventNotifications(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query(txn)
      .whereNot({ taskEventId: null })
      .andWhere({ userId, deletedAt: null, seenAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: eventNotifications.results,
      total: eventNotifications.total,
    };
  }

  static async getTaskEventNotifications(
    taskId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query(txn)
      .joinRelation('taskEvent')
      .where('event_notification.deletedAt', null)
      .andWhere('event_notification.seenAt', null)
      .andWhere('taskEvent.taskId', taskId)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where('deletedAt', null))
      .orderBy('event_notification.createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: eventNotifications.results,
      total: eventNotifications.total,
    };
  }

  // Fetch notifications for a given user and task
  static async getForUserTask(
    taskId: string,
    userId: string,
    txn: Transaction,
  ): Promise<EventNotification[]> {
    const eventNotifications = await this.query(txn)
      .whereNot({ taskEventId: null })
      .andWhere('event_notification.userId', userId)
      .andWhere('event_notification.deletedAt', null)
      .andWhere({ seenAt: null })
      .joinRelation('taskEvent')
      .where('taskEvent.taskId', taskId)
      .eager(EAGER_QUERY)
      .modifyEager('taskEvent', builder => builder.where({ deletedAt: null }))
      .orderBy('event_notification.createdAt', 'desc');

    return eventNotifications as EventNotification[];
  }
}
/* tslint:enable:member-ordering */
