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
  | 'edit_description';

const EAGER_QUERY = '[task, user, eventComment, eventUser]';

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

  static tableName = 'task_event';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      taskId: { type: 'string' },
      userId: { type: 'string' },
      eventType: { type: 'string' },
      eventCommentId: { type: 'string' },
      eventUserId: { type: 'string' },
      progressNoteId: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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
  };

  static async get(taskEventId: string): Promise<TaskEvent> {
    const taskEvent = await this.query()
      .eager(EAGER_QUERY)
      .findOne({ id: taskEventId, deletedAt: null });
    if (!taskEvent) {
      return Promise.reject(`No such taskEvent: ${taskEventId}`);
    }
    return taskEvent;
  }

  static async create(
    { taskId, userId, eventType, eventCommentId, eventUserId, skipNotifsCreate }: ITaskEventOptions,
    txn?: Transaction,
  ): Promise<TaskEvent> {
    const taskEvent = await this.query(txn)
      .eager(EAGER_QUERY)
      .insert({ taskId, userId, eventType, eventCommentId, eventUserId });

    const task = await Task.getIgnoreDeletedAt(taskId, txn);

    if (task.patientId) {
      await ProgressNote.autoOpenIfRequired({ patientId: task.patientId, userId }, txn);
    }

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

  static async delete(taskEventId: string): Promise<TaskEvent> {
    await this.query()
      .where({ id: taskEventId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const taskEvent = await this.query()
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
  ): Promise<IPaginatedResults<TaskEvent>> {
    const taskEvents = (await this.query()
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
  ): Promise<IPaginatedResults<TaskEvent>> {
    const taskEvents = (await this.query()
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
