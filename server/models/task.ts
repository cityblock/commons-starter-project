import { Model, QueryBuilder, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import CBOReferral from './cbo-referral';
import Patient from './patient';
import PatientGoal from './patient-goal';
import TaskEvent from './task-event';
import TaskFollower from './task-follower';
import User from './user';

export interface ITaskEditableFields {
  title: string;
  description?: string;
  dueAt?: string | null;
  patientId: string;
  patientGoalId?: string;
  createdById: string;
  completedById?: string;
  assignedToId?: string;
  priority?: Priority;
  CBOReferralId?: string | null;
}

export type TaskOrderOptions = 'createdAt' | 'dueAt' | 'updatedAt' | 'title';
interface ITaskPaginationOptions extends IPaginationOptions {
  orderBy: TaskOrderOptions;
  order: 'asc' | 'desc';
}

export type UserTaskOrderOptions = 'priority' | 'dueAt' | 'patient';
interface IUserTaskPaginationOptions extends IPaginationOptions {
  orderBy: UserTaskOrderOptions;
  order: 'asc' | 'desc';
}

interface IUserPatientTasksOptions {
  userId: string;
  patientId: string;
}

interface ITaskReassignOptions {
  patientId: string;
  userId: string;
  reassignedToId: string;
}

export type Priority = 'low' | 'medium' | 'high';
export const PRIORITY: Priority[] = ['low', 'medium', 'high'];

// TODO: Only fetch needed eager models
const EAGER_QUERY = `[
  createdBy,
  assignedTo,
  patient.[patientInfo, patientState],
  completedBy,
  followers,
  patientGoal.[patientConcern.[concern]],
  CBOReferral.[category, CBO],
]`;

/* tslint:disable:member-ordering */
export default class Task extends BaseModel {
  title: string;
  description: string;
  patient: Patient;
  patientId: string;
  createdBy: User;
  createdById: string;
  assignedTo: User;
  assignedToId: string;
  completedBy: User;
  completedById: string | null;
  patientGoalId: string;
  patientGoal: PatientGoal;
  dueAt: string | null;
  completedAt: string | null;
  followers: User[];
  priority: Priority;
  taskEvents: TaskEvent[];
  CBOReferralId: string | null;
  CBOReferral: CBOReferral | null;

  static tableName = 'task';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string', minLength: 1 }, // cannot be blank
      description: { type: 'string' },
      completedAt: { type: ['string', 'null'] },
      completedById: { type: ['string', 'null'] },
      assignedToId: { type: 'string', minLength: 1 }, // cannot be blank
      createdById: { type: 'string' },
      patientId: { type: 'string', minLength: 1 }, // cannot be blank
      patientGoalId: { type: 'string', minLength: 1 }, // cannot be blank
      dueAt: { type: ['string', 'null'] },
      priority: { type: 'string', enum: PRIORITY },
      CBOReferralId: { type: 'string', format: 'uuid' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['title', 'patientId'],
  };

  static relationMappings: RelationMappings = {
    patientGoal: {
      relation: Model.HasOneRelation,
      modelClass: 'patient-goal',
      join: {
        from: 'task.patientGoalId',
        to: 'patient_goal.id',
      },
    },

    createdBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task.createdById',
        to: 'user.id',
      },
    },

    completedBy: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task.completedById',
        to: 'user.id',
      },
    },

    assignedTo: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'task.assignedToId',
        to: 'user.id',
      },
    },

    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'task.patientId',
        to: 'patient.id',
      },
    },

    followers: {
      relation: Model.ManyToManyRelation,
      modelClass: 'user',
      join: {
        from: 'task.id',
        through: {
          from: 'task_follower.taskId',
          to: 'task_follower.userId',
        },
        to: 'user.id',
      },
    },

    comments: {
      relation: Model.HasManyRelation,
      modelClass: 'task-comment',
      join: {
        from: 'task.id',
        to: 'task_comment.id',
      },
    },

    taskEvents: {
      relation: Model.HasManyRelation,
      modelClass: 'task-event',
      join: {
        from: 'task_event.taskId',
        to: 'task.id',
      },
    },

    CBOReferral: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'cbo-referral',
      join: {
        from: 'task.CBOReferralId',
        to: 'cbo_referral.id',
      },
    },
  };

  static async get(taskId: string, txn: Transaction): Promise<Task> {
    const task = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .findOne({ id: taskId, deletedAt: null });

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async getIgnoreDeletedAt(taskId: string, txn: Transaction): Promise<Task> {
    const task = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .findOne({ id: taskId });

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async getPatientTasks(
    patientId: string,
    { pageNumber, pageSize, orderBy, order }: ITaskPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<Task>> {
    const patientsResult = (await this.query(txn)
      .where({ patientId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .orderBy(orderBy, order)
      .page(pageNumber, pageSize)) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static orderByPatientName(
    queryBuilder: QueryBuilder<Model, Model[], Model[]>,
    order: 'asc' | 'desc',
  ) {
    return queryBuilder.orderBy('patient.firstName', order).orderBy('patient.lastName', order);
  }

  static orderByPriority(
    queryBuilder: QueryBuilder<Model, Model[], Model[]>,
    order: 'asc' | 'desc',
  ) {
    return queryBuilder.orderByRaw(`
        (case priority
          when 'low' then 2
          when 'medium' then 3
          when 'high' then 4
          else 1
        end) ${order}
      `);
  }

  static async getUserTasks(
    userId: string,
    { pageNumber, pageSize, orderBy, order }: IUserTaskPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<Task>> {
    const queryBuilder = this.query(txn)
      .orWhere({ assignedToId: userId, deletedAt: null })
      .joinRelation('patient')
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null));

    if (orderBy === 'patient') {
      this.orderByPatientName(queryBuilder, order);
      this.orderByPriority(queryBuilder, 'desc');
      queryBuilder.orderBy('dueAt', 'asc');
    } else if (orderBy === 'priority') {
      this.orderByPriority(queryBuilder, order);
      queryBuilder.orderBy('dueAt', 'asc');
      this.orderByPatientName(queryBuilder, 'asc');
    } else if (orderBy === 'dueAt') {
      queryBuilder.orderBy('dueAt', order);
      this.orderByPriority(queryBuilder, 'desc');
      this.orderByPatientName(queryBuilder, 'asc');
    }

    const userTasks = (await queryBuilder.page(pageNumber, pageSize)) as any;

    return {
      results: userTasks.results,
      total: userTasks.total,
    };
  }

  static async getAllUserPatientTasks(
    { userId, patientId }: IUserPatientTasksOptions,
    txn: Transaction,
  ): Promise<Task[]> {
    const subquery = TaskFollower.query(txn)
      .joinRelation('task')
      .where('task.patientId', patientId)
      .select('task_follower.taskId')
      .where('task_follower.userId', userId)
      .andWhere('task_follower.deletedAt', null) as any;

    return this.query(txn)
      .where('id', 'in', subquery)
      .andWhere({ patientId, deletedAt: null })
      .orWhere({ assignedToId: userId, patientId, deletedAt: null });
  }

  static async create(input: ITaskEditableFields, txn: Transaction) {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .insertAndFetch(input);
  }

  static async update(
    taskId: string,
    task: Partial<ITaskEditableFields>,
    txn: Transaction,
  ): Promise<Task> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .patchAndFetchById(taskId, task);
  }

  static async reassignForUserForPatient(
    { userId, patientId, reassignedToId }: ITaskReassignOptions,
    txn: Transaction,
  ): Promise<number> {
    return this.query(txn)
      .where({ patientId, assignedToId: userId, deletedAt: null })
      .patch({ assignedToId: reassignedToId });
  }

  static async delete(taskId: string, txn: Transaction): Promise<Task | undefined> {
    await this.query(txn)
      .where({ id: taskId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const task = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .findById(taskId);

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async complete(taskId: string, userId: string, txn: Transaction): Promise<Task> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .patchAndFetchById(taskId, {
        completedAt: new Date().toISOString(),
        completedById: userId,
      });
  }

  static async uncomplete(taskId: string, userId: string, txn: Transaction): Promise<Task> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .patchAndFetchById(taskId, {
        completedAt: null,
        completedById: null,
      });
  }

  static async getTasksDueSoonForPatient(patientId: string, userId: string, txn: Transaction) {
    return this.query(txn)
      .whereRaw('task."dueAt" < now() + interval \'1 day\'')
      .andWhere({ patientId, assignedToId: userId, deletedAt: null })
      .eager('followers')
      .modifyEager('followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .orderBy('dueAt', 'ASC');
  }

  static async getTasksWithNotificationsForPatient(
    patientId: string,
    userId: string,
    txn: Transaction,
  ) {
    return this.query(txn)
      .whereRaw(
        `task.id IN (
        SELECT task.id
        FROM task
        INNER JOIN task_event ON task_event."taskId" = task.id AND task_event."deletedAt" IS NULL
        INNER JOIN event_notification ON event_notification."taskEventId" = task_event.id
          AND event_notification."userId" = ?
          AND event_notification."seenAt" IS NULL
          AND event_notification."deletedAt" IS NULL
        WHERE task."patientId" = ?
      )`,
        [userId, patientId],
      )
      .eager('followers')
      .modifyEager('followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .orderBy('dueAt', 'ASC');
  }

  static async getTaskIdsWithNotifications(userId: string, txn: Transaction) {
    return this.query(txn)
      .distinct('task.id')
      .from('task')
      .joinRaw(
        `
        INNER JOIN task_event ON task_event."taskId" = task.id AND task_event."deletedAt" IS NULL
        INNER JOIN event_notification ON event_notification."taskEventId" = task_event.id
          AND event_notification."userId" = ?
          AND event_notification."seenAt" IS NULL
          AND event_notification."deletedAt" IS NULL
        `,
        userId,
      );
  }

  static async getForCBOReferralFormPDF(taskId: string, txn: Transaction) {
    const task = await this.query(txn)
      .eager(
        '[assignedTo, createdBy, patient.[careTeam, patientInfo.[primaryAddress, primaryPhone], patientState], CBOReferral.[category, CBO]]',
      )
      .findOne({ id: taskId, deletedAt: null });

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async getPatientIdForResource(taskId: string, txn: Transaction): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(taskId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
