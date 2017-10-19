import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientGoal from './patient-goal';
import TaskFollower from './task-follower';
import User from './user';

export interface ITaskEditableFields {
  title: string;
  description?: string;
  dueAt?: string;
  patientId: string;
  patientGoalId?: string;
  createdById: string;
  completedById?: string;
  assignedToId?: string;
  priority?: Priority;
}

export type TaskOrderOptions = 'createdAt' | 'dueAt' | 'updatedAt';

export interface ITaskPaginationOptions extends IPaginationOptions {
  orderBy: TaskOrderOptions;
  order: 'asc' | 'desc';
}

export type Priority = 'low' | 'medium' | 'high';

// TODO: Only fetch needed eager models
const EAGER_QUERY = '[createdBy, assignedTo, patient, completedBy, followers, patientGoal]';

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
  dueAt: string;
  completedAt: string | null;
  followers: User[];
  priority: Priority;

  static tableName = 'task';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      completedAt: { type: ['string', 'null'] },
      completedById: { type: ['string', 'null'] },
      assignedToId: { type: 'string' },
      createdById: { type: 'string' },
      patientId: { type: 'string' },
      patientGoalId: { type: 'string' },
      dueAt: { type: 'string' },
      priority: { type: 'string' },
      deletedAt: { type: 'string' },
    },
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
  };

  static async get(taskId: string, txn?: Transaction): Promise<Task> {
    const task = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .findOne({ id: taskId, deletedAt: null });

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async getIgnoreDeletedAt(taskId: string, txn?: Transaction): Promise<Task> {
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
  ): Promise<IPaginatedResults<Task>> {
    const patientsResult = (await this.query()
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

  static async getUserTasks(
    userId: string,
    { pageNumber, pageSize, orderBy, order }: ITaskPaginationOptions,
  ): Promise<IPaginatedResults<Task>> {
    const subquery = TaskFollower.query()
      .select('taskId')
      .where({ userId, deletedAt: null }) as any; // TODO: resolve typing issue
    const userTasks = (await this.query()
      .where('id', 'in', subquery)
      .orWhere({ createdById: userId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .orderBy(orderBy, order)
      .page(pageNumber, pageSize)) as any;

    return {
      results: userTasks.results,
      total: userTasks.total,
    };
  }

  static async create(input: ITaskEditableFields, txn?: Transaction) {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .insertAndFetch(input);
  }

  static async update(
    taskId: string,
    task: Partial<ITaskEditableFields>,
    txn?: Transaction,
  ): Promise<Task> {
    return await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => {
        builder.where('task_follower.deletedAt', null);
      })
      .updateAndFetchById(taskId, task);
  }

  static async delete(taskId: string, txn?: Transaction): Promise<Task | undefined> {
    await this.query(txn)
      .where({ id: taskId, deletedAt: null })
      .update({ deletedAt: new Date().toISOString() });

    const task = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .findById(taskId);

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async complete(taskId: string, userId: string, txn?: Transaction): Promise<Task> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .updateAndFetchById(taskId, {
        completedAt: new Date().toUTCString(),
        completedById: userId,
      });
  }

  static async uncomplete(taskId: string, userId: string, txn?: Transaction): Promise<Task> {
    return this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('task_follower.deletedAt', null))
      .updateAndFetchById(taskId, {
        completedAt: null,
        completedById: null,
      });
  }
}
/* tslint:disable:member-ordering */
