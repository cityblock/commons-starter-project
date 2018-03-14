import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import EventNotification from './event-notification';
import ProgressNote from './progress-note';
import Task from './task';
import TaskComment from './task-comment';
import User from './user';

interface ITaskEventOptions {
  taskId: string;
  userId: string;
  eventType: EventTypes;
  eventCommentId?: string;
  eventUserId?: string;
  skipNotifsCreate?: boolean;
  progressNoteId?: string;
}

type EventTypes =
  | 'create_task'
  | 'add_follower'
  | 'remove_follower'
  | 'complete_task'
  | 'uncomplete_task'
  | 'delete_task'
  | 'add_comment'
  | 'edit_comment'
  | 'delete_comment'
  | 'edit_priority'
  | 'edit_due_date'
  | 'edit_assignee'
  | 'edit_title'
  | 'edit_description'
  | 'cbo_referral_edit_sent_at'
  | 'cbo_referral_edit_acknowledged_at';

const EVENT_TYPES: EventTypes[] = [
  'create_task',
  'add_follower',
  'remove_follower',
  'complete_task',
  'uncomplete_task',
  'delete_task',
  'add_comment',
  'edit_comment',
  'delete_comment',
  'edit_priority',
  'edit_due_date',
  'edit_assignee',
  'edit_title',
  'edit_description',
  'cbo_referral_edit_sent_at',
  'cbo_referral_edit_acknowledged_at',
];

const EAGER_QUERY =
  '[task.[createdBy, followers, assignedTo, patient.[patientInfo, patientState], completedBy], user, eventComment.[user], eventUser]';

/* tslint:disable:member-ordering */
export default class TaskEvent extends BaseModel {
  taskId: string;
  task: Task;
  userId: string;
  user: User;
  eventType: EventTypes;
  eventCommentId: string;
  eventComment: TaskComment;
  eventUserId: string;
  eventUser: User;
  progressNote: ProgressNote;
  progressNoteId: string;
  eventNotifications: EventNotification[];

  static tableName = 'task_event';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string', minLength: 1 }, // cannot be blank
      userId: { type: 'string', minLength: 1 }, // cannot be blank
      eventType: { type: 'string', enum: EVENT_TYPES }, // cannot be blank
      eventCommentId: { type: 'string' },
      eventUserId: { type: 'string' },
      progressNoteId: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['taskId', 'userId', 'eventType'],
  };

  static relationMappings: RelationMappings = {
    task: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'task',
      join: {
        from: 'task_event.taskId',
        to: 'task.id',
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task_event.userId',
        to: 'user.id',
      },
    },

    eventComment: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'task-comment',
      join: {
        from: 'task_event.eventCommentId',
        to: 'task_comment.id',
      },
    },

    eventUser: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task_event.eventUserId',
        to: 'user.id',
      },
    },

    progressNote: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'progress-note',
      join: {
        from: 'task_event.progressNoteId',
        to: 'progress_note.id',
      },
    },

    eventNotifications: {
      relation: Model.HasManyRelation,
      modelClass: 'event-notification',
      join: {
        from: 'event_notification.taskEventId',
        to: 'task_event.id',
      },
    },
  };

  static async get(taskEventId: string, txn: Transaction): Promise<TaskEvent> {
    const taskEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findOne({ id: taskEventId, deletedAt: null });
    if (!taskEvent) {
      return Promise.reject(`No such taskEvent: ${taskEventId}`);
    }
    return taskEvent;
  }

  static async getAllForProgressNote(
    progressNoteId: string,
    txn: Transaction,
  ): Promise<TaskEvent[]> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .where({ progressNoteId, deletedAt: null });
  }

  static async create(
    { taskId, userId, eventType, eventCommentId, eventUserId, skipNotifsCreate }: ITaskEventOptions,
    txn: Transaction,
  ): Promise<TaskEvent> {
    let progressNoteId: string | undefined;
    const task = await Task.getIgnoreDeletedAt(taskId, txn);

    if (task.patientId) {
      const progressNote = await ProgressNote.autoOpenIfRequired(
        { patientId: task.patientId, userId },
        txn,
      );

      progressNoteId = progressNote.id;
    }

    const taskEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .insert({ taskId, userId, eventType, eventCommentId, eventUserId, progressNoteId });

    if (!skipNotifsCreate) {
      await EventNotification.createTaskNotifications(
        {
          initiatingUserId: userId,
          taskEventId: taskEvent.id,
          taskId,
        },
        txn,
      );
    }

    return taskEvent;
  }

  static async delete(taskEventId: string, txn: Transaction): Promise<TaskEvent> {
    await this.query(txn)
      .where({ id: taskEventId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const taskEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .findById(taskEventId);
    if (!taskEvent) {
      return Promise.reject(`No such taskEvent: ${taskEventId}`);
    }
    return taskEvent;
  }

  static async getTaskEvents(
    taskId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<TaskEvent>> {
    const taskEvents = (await this.query(txn)
      .where({ taskId, deletedAt: null })
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: taskEvents.results,
      total: taskEvents.total,
    };
  }

  static async getUserTaskEvents(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<TaskEvent>> {
    const taskEvents = (await this.query(txn)
      .where({ userId, deletedAt: null })
      .eager(EAGER_QUERY)
      .orderBy('createdAt', 'desc')
      .page(pageNumber, pageSize)) as any;

    return {
      results: taskEvents.results,
      total: taskEvents.total,
    };
  }
}
/* tslint:enable:member-ordering */
