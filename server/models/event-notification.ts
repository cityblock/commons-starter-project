import { uniq } from 'lodash';
import { Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Task from './task';
import TaskEvent from './task-event';
import User from './user';

export interface IEventNotificationEditableFields {
  seenAt?: string;
}

export interface IEventNotificationOptions {
  userId: string;
  taskEventId?: string;
}

export interface ICreateTaskNotificationsOptions {
  initiatingUserId: string;
  taskEventId: string;
  taskId: string;
}

/* tslint:disable:max-line-length */
// TODO: figure out why the [relation.^] style doesn't work to eager load the whole tree recursively
const EAGER_QUERY =
  '[task.[patient, assignedTo, createdBy, followers], taskEvent.[task, user, eventComment.[user], eventUser], user]';
/* tslint:enable:max-line-length */

/* tslint:disable:member-ordering */
export default class EventNotification extends Model {
  id: string;
  userId: string;
  user: User;
  taskEventId: string;
  taskEvent: TaskEvent;
  task: Task;
  seenAt: string;
  emailSentAt: string;
  deliveredAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;

  static tableName = 'event_notification';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string' },
      taskEventId: { type: 'string' },
      seenAt: { type: 'string' },
      emailSentAt: { type: 'string' },
      deliveredAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'event_notification.userId',
        to: 'user.id',
      },
    },

    taskEvent: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'task-event',
      join: {
        from: 'event_notification.taskEventId',
        to: 'task_event.id',
      },
    },

    task: {
      relation: Model.HasOneThroughRelation,
      modelClass: 'task',
      join: {
        from: 'event_notification.taskEventId',
        through: {
          modelClass: 'task-event',
          from: 'task_event.id',
          to: 'task_event.taskId',
        },
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

  static async get(eventNotificationId: string): Promise<EventNotification> {
    const eventNotification = await this.query()
      .eager(EAGER_QUERY)
      .findById(eventNotificationId);
    if (!eventNotification) {
      return Promise.reject(`No such eventNotification: ${eventNotificationId}`);
    }
    return eventNotification;
  }

  static async create(
    { taskEventId, userId }: IEventNotificationOptions,
    txn?: Transaction,
  ): Promise<EventNotification> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .insert({ taskEventId, userId });
  }

  static async createTaskNotifications(
    { initiatingUserId, taskEventId, taskId }: ICreateTaskNotificationsOptions,
    txn?: Transaction,
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

  static async delete(eventNotificationId: string): Promise<EventNotification> {
    await this.query()
      .where({ id: eventNotificationId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const eventNotification = await this.query().findById(eventNotificationId);
    if (!eventNotification) {
      return Promise.reject(`No such eventNotification: ${eventNotificationId}`);
    }
    return eventNotification;
  }

  static async update(
    eventNotificationId: string,
    eventNotification: Partial<IEventNotificationEditableFields>,
  ): Promise<EventNotification> {
    return await this.query()
      .eager(EAGER_QUERY)
      .updateAndFetchById(eventNotificationId, eventNotification);
  }

  // Fetch all event notifications for a user
  static async getUserEventNotifications(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query()
      .where({ userId, deletedAt: null, seenAt: null })
      .eager(EAGER_QUERY)
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
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query()
      .whereNot({ taskEventId: null })
      .andWhere({ userId, deletedAt: null, seenAt: null })
      .eager(EAGER_QUERY)
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
  ): Promise<IPaginatedResults<EventNotification>> {
    const eventNotifications = (await this.query()
      .joinRelation('task')
      .where('event_notification.deletedAt', null)
      .andWhere('event_notification.seenAt', null)
      .andWhere('task.id', taskId)
      .eager(EAGER_QUERY)
      .orderBy('event_notification.createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: eventNotifications.results,
      total: eventNotifications.total,
    };
  }
}
/* tslint:disable:member-ordering */
