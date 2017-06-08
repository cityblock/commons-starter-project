import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid/v4';
import { IPaginatedResults, IPaginationOptions } from '../db';
import Clinic from './clinic';

interface IEditPatient {
  firstName?: string;
  lastName?: string;
  homeClinicId?: string;
  dateOfBirth?: string;
  zip?: number;
  gender?: string;
  athenaPatientId?: number;
}

export interface ISetupPatient {
  firstName: string;
  lastName: string;
  gender: string;
  zip: number;
  homeClinicId: string;
  dateOfBirth: string; // mm/dd/yy
}

type GetByOptions = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends Model {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  zip: number;
  createdAt: string;
  updatedAt: string;
  athenaPatientId: number;
  homeClinicId: string;
  homeClinic: Clinic;
  scratchPad: string;

  static tableName = 'patient';

  static modelPaths = [__dirname];

  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      athenaPatientId: { type: 'number' },
      homeClinicId: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      gender: { type: 'string' },
      dateOfBirth: { type: 'string' },
      zip: { type: 'number' },
      scratchPad: { type: 'text' },
    },
  };

  static relationMappings: RelationMappings = {
    homeClinic: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'clinic',
      join: {
        from: 'patient.homeClinicId',
        to: 'clinic.id',
      },
    },

    careTeam: {
      relation: Model.ManyToManyRelation,
      modelClass: 'user',
      join: {
        from: 'patient.id',
        through: {
          from: 'care_team.patientId',
          to: 'care_team.userId',
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

  static async get(patientId: string): Promise<Patient> {
    const patient = await this
      .query()
      .findById(patientId);

    if (!patient) {
      return Promise.reject(`No such patient: ${patientId}`);
    }
    return patient;
  }

  static async getAthenaPatientId(patientId: string): Promise<number> {
    // TODO: query and just return the athenaPatientId column
    const patient = await this.get(patientId);
    return patient.athenaPatientId;
  }

  static async getAll(
    { pageNumber, pageSize }: IPaginationOptions,
  ): Promise<IPaginatedResults<Patient>> {
    const patientsResult = await this
      .query()
      .page(pageNumber, pageSize) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
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

  static async setup(input: ISetupPatient) {
    return this.query().insertAndFetch(input);
  }

  static async edit(patient: IEditPatient, patientId: string): Promise<Patient> {
    return await this.query().updateAndFetchById(patientId, patient);
  }

  // limit accidentally editing the athenaPatientId by only allowing it explicitly here
  static async addAthenaPatientId(athenaPatientId: number, patientId: string): Promise<Patient> {
    return this
      .query()
      .updateAndFetchById(patientId, { athenaPatientId });
  }

  static async execWithTransaction(
    callback: (boundModelClass: typeof Patient) => Promise<Patient>,
  ) {
    return await transaction(this, callback);
  }

}
/* tslint:disable:member-ordering */
