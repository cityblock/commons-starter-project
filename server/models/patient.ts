import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid';
import { IPaginatedResults, IPaginationOptions } from '../db';
import CareTeam from './care-team';
import Clinic from './clinic';

interface ICreatePatient {
  athenaPatientId: number;
  firstName: string;
  lastName: string;
  homeClinicId: string;
  dob?: string;
  sex?: 'M' | 'F';
}

type GetByOptions = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends Model {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  sex: 'M' | 'F';
  createdAt: string;
  updatedAt: string;
  athenaPatientId: number;
  homeClinicId: string;
  homeClinic: Clinic;

  static tableName = 'patient';

  static modelPaths = [__dirname];

  static jsonSchema = {
    type: 'object',
    required: ['athenaPatientId', 'homeClinicId'],
    properties: {
      id: { type: 'string' },
      athenaPatientId: { type: 'number' },
      homeClinicId: { type: 'string' },
      firstName: { type: 'string' },
      lastName: { type: 'string' },
      dob: { type: 'string' },
      sex: { type: 'string' },
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
    this.id = uuid.v4();
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

  static async create(patient: ICreatePatient, userId: string): Promise<Patient> {
    const instance = await this.query().insertAndFetch(patient);
    await CareTeam.addUserToCareTeam({ userId, patientId: instance.id });
    return instance;
  }

}
/* tslint:disable:member-ordering */
