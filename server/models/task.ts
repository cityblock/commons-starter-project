import { transaction, Model, RelationMappings, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Patient from './patient';
import TaskFollower from './task-follower';
import User from './user';

export interface ITaskEditableFields {
  title: string;
  description?: string;
  dueAt?: string;
  patientId: string;
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
const EAGER_QUERY = '[createdBy, assignedTo, patient, completedBy, followers]';

/* tslint:disable:member-ordering */
export default class Task extends Model {
  id: string;
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
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  completedAt: string | null;
  deletedAt?: string;
  followers: User[];
  priority: Priority;

  static tableName = 'task';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

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
      dueAt: { type: 'string' },
      priority: { type: 'string' },
      deletedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
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

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async get(taskId: string): Promise<Task> {
    const task = await this
      .query()
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .findById(taskId);

    if (!task) {
      return Promise.reject(`No such task: ${taskId}`);
    }
    return task;
  }

  static async getPatientTasks(
    patientId: string,
    { pageNumber, pageSize, orderBy, order }: ITaskPaginationOptions,
  ): Promise<IPaginatedResults<Task>> {
    const patientsResult = await this
      .query()
      .where({ patientId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .orderBy(orderBy, order)
      .page(pageNumber, pageSize) as any;

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
    const userTasks = await this
      .query()
      .where('id', 'in', subquery)
      .orWhere({ createdById: userId, deletedAt: null })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .orderBy(orderBy, order)
      .page(pageNumber, pageSize) as any;

    return {
      results: userTasks.results,
      total: userTasks.total,
    };
  }

  static async create(input: ITaskEditableFields, txn?: Transaction<any>) {
    return await this
      .query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .insertAndFetch(input);
  }

  static async update(
    taskId: string, task: Partial<ITaskEditableFields>, txn?: Transaction<any>,
  ): Promise<Task> {
    return await this
      .query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => {
        builder.where('deletedAt', null);
      })
      .updateAndFetchById(taskId, task);
  }

  static async delete(taskId: string, txn?: Transaction<any>): Promise<Task> {
    return await this.query(txn)
      .updateAndFetchById(taskId, {
        deletedAt: new Date().toISOString(),
      });
  }

  static async complete(taskId: string, userId: string, txn?: Transaction<any>): Promise<Task> {
    return this
      .query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .updateAndFetchById(taskId, {
        completedAt: new Date().toUTCString(),
        completedById: userId,
      });
  }

  static async uncomplete(taskId: string, userId: string, txn?: Transaction<any>): Promise<Task> {
    return this
      .query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .updateAndFetchById(taskId, {
        completedAt: null,
        completedById: null,
      });
  }

  static async execWithTransaction(
    callback: (boundModelClass: typeof Task) => Promise<Task>,
  ) {
    return await transaction(this as any, callback);
  }
}
/* tslint:disable:member-ordering */
