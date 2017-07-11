import { Model, RelationMappings } from 'objection';
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
}

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
  completedById: string;
  createdAt: string;
  updatedAt: string;
  dueAt: string;
  completedAt: string;
  followers: User[];

  static tableName = 'task';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      title: { type: 'string' },
      description: { type: 'string' },
      completedAt: { type: 'string' },
      completedById: { type: 'string' },
      assignedToId: { type: 'string' },
      createdById: { type: 'string' },
      patientId: { type: 'string' },
      dueAt: { type: 'string' },
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
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<Task>> {
    const patientsResult = await this
      .query()
      .where({ patientId })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .page(pageNumber, pageSize) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async getUserTasks(
    userId: string,
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<Task>> {
    const subquery = TaskFollower.query()
      .select('taskId')
      .where({ userId, deletedAt: null });
    const userTasks = await this
      .query()
      .where('id', 'in', subquery)
      .orWhere({ createdById: userId })
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .orderBy('createdAt')
      .page(pageNumber, pageSize) as any;

    return {
      results: userTasks.results,
      total: userTasks.total,
    };
  }

  static async create(input: ITaskEditableFields) {
    return await this
      .query()
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))

      .insertAndFetch(input);
  }

  static async update(taskId: string, task: Partial<ITaskEditableFields>): Promise<Task> {
    return await this
      .query()
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => {
        builder.where('deletedAt', null);
      })
      .updateAndFetchById(taskId, task);
  }

  static async complete(taskId: string, userId: string): Promise<Task> {
    return this
      .query()
      .eager(EAGER_QUERY)
      .modifyEager('followers', builder => builder.where('deletedAt', null))
      .updateAndFetchById(taskId, {
        completedAt: new Date().toUTCString(),
        completedById: userId,
      });
  }
}
/* tslint:disable:member-ordering */
