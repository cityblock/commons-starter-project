import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Patient from './patient';
import User from './user';

export interface IClinicEditableFields {
  name: string;
  departmentId: number;
}

export type GetByOptions = 'name' | 'departmentId';

/* tslint:disable:member-ordering */
export default class Clinic extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  name: string;
  departmentId: number;
  users: User[];
  patients: Patient[];

  static tableName = 'clinic';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    required: ['name', 'departmentId'],
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      departmentId: { type: 'integer' },
    },
  };

  static relationMappings: RelationMappings = {
    users: {
      relation: Model.HasManyRelation,
      modelClass: 'user',
      join: {
        from: 'clinic.id',
        to: 'user.homeClinicId',
      },
    },
    patients: {
      relation: Model.HasManyRelation,
      modelClass: 'patient',
      join: {
        from: 'clinic.id',
        to: 'patient.homeClinicId',
      },
    },
  };

  async $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async create(clinic: IClinicEditableFields): Promise<Clinic> {
    return await this.query().insertAndFetch(clinic);
  }

  static async get(clinicId: string): Promise<Clinic> {
    const clinic = await this.query().findById(clinicId);

    if (!clinic) {
      return Promise.reject(`No such clinic for clinicId: ${clinicId}`);
    }

    return clinic;
  }

  static async update(clinicId: string, clinic: IClinicEditableFields): Promise<Clinic> {
    return await this.query().updateAndFetchById(clinicId, clinic);
  }

  static async getAll({
    pageNumber,
    pageSize,
  }: IPaginationOptions): Promise<IPaginatedResults<Clinic>> {
    const clinics = (await this.query().page(pageNumber, pageSize)) as any;

    return clinics;
  }

  static async getBy(fieldName: GetByOptions, field?: string | number): Promise<Clinic | null> {
    if (!field) {
      return null;
    }

    const clinic = await this.query()
      .where(fieldName, field)
      .first();

    if (!clinic) {
      return null;
    }

    return clinic;
  }
}
/* tslint:disable:member-ordering */
