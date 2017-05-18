import { transaction, Model, RelationMappings } from 'objection';
import * as uuid from 'uuid';
import { IPageOptions } from '../db';
import Clinic from './clinic';
import User from './user';

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
  careTeam: User[];

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
      .findById(patientId)
      .eager('careTeam');

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
      .eager('careTeam')
      .first();

    if (!patient) {
      return null;
    }
    return patient;
  }

  static async create(patient: ICreatePatient, userId: string): Promise<Patient> {
    const instance = await this.query().insertAndFetch(patient);
    await this.addUserToCareTeam(userId, instance.id);
    return instance;
  }

  static async addUserToCareTeam(userId: string, patientId: string): Promise<Patient> {
    // TODO: use postgres UPCERT here to add relation if it doesn't exist instead of a transaction
    await transaction(User, async UserWithTransaction => {
      const user = await UserWithTransaction
        .query()
        .findById(userId);
      if (!user) {
        throw new Error('user not found');
      } else {
        const relations = await user
          .$relatedQuery('patients')
          .where('patientId', patientId);
        if (relations.length < 1) {
          await user
            .$relatedQuery('patients')
            .relate(patientId);
        }
      }
    });
    return await this.get(patientId);
  }

  static async removeUserFromCareTeam(userId: string, patientId: string): Promise<Patient> {
    await transaction(User, async UserWithTransaction => {
      const user = await UserWithTransaction
        .query()
        .findById(userId);
      if (!user) {
        throw new Error('user not found');
      } else {
        await user
          .$relatedQuery('patients')
          .where('patientId', patientId)
          .unrelate();
      }
    });
    return await this.get(patientId);
  }

}
/* tslint:disable:member-ordering */
