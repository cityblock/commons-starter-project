import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import Concern from './concern';
import Patient from './patient';

export interface IPatientConcernEditableFields {
  order: number;
  concernId: string;
  patientId: string;
  startedAt?: string;
  completedAt?: string;
}

/* tslint:disable:member-ordering */
export default class PatientConcern extends Model {
  id: string;
  order: number;
  concernId: string;
  concern: Concern;
  patientId: string;
  patient: Patient;
  startedAT: string;
  completedAt: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;

  static tableName = 'patient_concern';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      order: { type: 'integer' },
      patientId: { type: 'string' },
      concernId: { type: 'string' },
      deletedAt: { type: 'string' },
      startedAt: { type: 'string' },
      completedAt: { type: 'string' },
    },
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.HasOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_concern.patientId',
        to: 'patient.id',
      },
    },
    concern: {
      relation: Model.HasOneRelation,
      modelClass: 'concern',
      join: {
        from: 'patient_concern.concernId',
        to: 'concern.id',
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

  static async get(patientConcernId: string): Promise<PatientConcern | undefined> {
    const patientConcern = await this.query().findById(patientConcernId);

    if (!patientConcern) {
      return Promise.reject(`No such patient concern: ${patientConcernId}`);
    }
    return patientConcern;
  }

  static async create(input: IPatientConcernEditableFields) {
    return await this
      .query()
      .insertAndFetch(input);
  }

  static async update(
    patientConcernId: string, concern: Partial<IPatientConcernEditableFields>,
  ): Promise<PatientConcern> {
    return await this
      .query()
      .updateAndFetchById(patientConcernId, concern);
  }

  static async getForPatient(patientId: string): Promise<PatientConcern[]> {
    return await this.query()
      .where('deletedAt', null)
      .andWhere('patientId', patientId)
      .orderBy('order');
  }

  static async delete(patientConcernId: string): Promise<PatientConcern> {
    return await this.query()
      .updateAndFetchById(patientConcernId, {
        deletedAt: new Date().toISOString(),
      });
  }
}
/* tslint:disable:member-ordering */
