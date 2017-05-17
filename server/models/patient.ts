import { Model } from 'objection';
import * as uuid from 'uuid';
import { IPageOptions } from '../db';

interface ICreatePatient {
  athenaPatientId: number;
  firstName: string;
  lastName: string;
}

type GetByOptions = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends Model {
  id: string;
  createdAt: string;
  updatedAt: string;
  athenaPatientId: number;

  static tableName = 'patient';

  $beforeInsert() {
    this.id = uuid.v4();
    this.createdAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static jsonSchema = {
    type: 'object',
    required: ['athenaPatientId'],
    properties: {
      id: { type: 'string' },
      athenaPatientId: { type: 'number' },
    },
  };

  static modelPaths = [__dirname];

  static async get(patientId: string): Promise<Patient> {
    const patient = await this
      .query()
      .findById(patientId);

    if (!patient) {
      return Promise.reject(`No such patient: ${patientId}`);
    }
    return patient;
  }

  static async getAll({ limit, offset }: IPageOptions): Promise<Patient[]> {
    const patients = await this
      .query()
      .limit(limit || 0)
      .offset(offset || 0);

    return patients;
  }

  static async getBy(fieldName: GetByOptions, field?: string): Promise<Patient | null> {
    if (!field) {
      return null;
    }

    const patient = await this
      .query()
      .where(fieldName, field)
      .first();

    if (!patient) {
      return null;
    }
    return patient;
  }

  static async create(patient: ICreatePatient): Promise<Patient> {
    return await this.query().insertAndFetch(patient);
  }

}
/* tslint:disable:member-ordering */
