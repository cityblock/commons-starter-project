import { Model, RelationMappings } from 'objection';
import * as uuid from 'uuid';
import { IPageOptions } from '../db';
import CareTeam from './care-team';
import Clinic from './clinic';

interface ICreatePatient {
  athenaPatientId: number;
  firstName: string;
  lastName: string;
  homeClinicId: string;
}

type GetByOptions = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends Model {
  id: string;
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

  static async create(patient: ICreatePatient, userId: string): Promise<Patient> {
    const instance = await this.query().insertAndFetch(patient);
    await CareTeam.addUserToCareTeam({ userId, patientId: instance.id });
    return instance;
  }

}
/* tslint:disable:member-ordering */
