import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { attributionUserClinicDepartmentId, attributionUserClinicName } from '../lib/consts';
import BaseModel from './base-model';
import Patient from './patient';
import User from './user';

interface IClinicEditableFields {
  name: string;
  departmentId: number;
}

interface IGetByOptions {
  fieldName: GetByFields;
  field?: string | number;
}

type GetByFields = 'name' | 'departmentId';

/* tslint:disable:member-ordering */
export default class Clinic extends BaseModel {
  name!: string;
  departmentId!: number;
  users!: User[];
  patients!: Patient[];

  static tableName = 'clinic';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string', minLength: 1 }, // cannot be blank
      departmentId: { type: 'integer', minLength: 1 }, // cannot be blank
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['name', 'departmentId'],
  };

  static get relationMappings(): RelationMappings {
    return {
      users: {
        relation: Model.HasManyRelation,
        modelClass: User,
        join: {
          from: 'clinic.id',
          to: 'user.homeClinicId',
        },
      },
      patients: {
        relation: Model.HasManyRelation,
        modelClass: Patient,
        join: {
          from: 'clinic.id',
          to: 'patient.homeClinicId',
        },
      },
    };
  }

  static async create(clinic: IClinicEditableFields, txn: Transaction): Promise<Clinic> {
    return this.query(txn).insertAndFetch(clinic);
  }

  static async findOrCreateAttributionClinic(txn: Transaction): Promise<Clinic> {
    const clinic = await this.query(txn).findOne({
      name: attributionUserClinicName,
      departmentId: attributionUserClinicDepartmentId,
    });

    if (!clinic) {
      return this.query(txn).insertAndFetch({
        name: attributionUserClinicName,
        departmentId: attributionUserClinicDepartmentId,
      });
    }

    return clinic;
  }

  static async get(clinicId: string, txn: Transaction): Promise<Clinic> {
    const clinic = await this.query(txn).findById(clinicId);

    if (!clinic) {
      return Promise.reject(`No such clinic for clinicId: ${clinicId}`);
    }

    return clinic;
  }

  static async update(
    clinicId: string,
    clinic: IClinicEditableFields,
    txn: Transaction,
  ): Promise<Clinic> {
    return this.query(txn).patchAndFetchById(clinicId, clinic);
  }

  static async getAll(
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<Clinic>> {
    const clinics = (await this.query(txn).page(pageNumber, pageSize)) as any;

    return clinics;
  }

  static async getBy(input: IGetByOptions, txn: Transaction): Promise<Clinic | null> {
    if (!input.field) {
      return null;
    }

    const clinic = await this.query(txn)
      .where(input.fieldName, input.field)
      .first();

    if (!clinic) {
      return null;
    }

    return clinic;
  }
}
/* tslint:enable:member-ordering */
