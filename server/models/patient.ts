import { transaction, Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Clinic from './clinic';
import Concern, { adminTasksConcernTitle } from './concern';
import PatientConcern from './patient-concern';

export interface IPatientEditableFields {
  firstName: string;
  middleName?: string | undefined | null;
  lastName: string;
  gender: string;
  zip: string;
  homeClinicId: string;
  dateOfBirth: string; // mm/dd/yy
  consentToCall: boolean;
  consentToText: boolean;
  language: string;
}

interface IEditPatient extends Partial<IPatientEditableFields> {
  athenaPatientId?: number;
  scratchPad?: string;
}

type GetByOptions = 'athenaPatientId';

/* tslint:disable:member-ordering */
export default class Patient extends BaseModel {
  firstName: string;
  lastName: string;
  middleName: string | null;
  dateOfBirth: string;
  gender: string;
  zip: string;
  athenaPatientId: number;
  homeClinicId: string;
  homeClinic: Clinic;
  scratchPad: string;
  consentToCall: boolean;
  consentToText: boolean;
  language: string;

  static tableName = 'patient';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      athenaPatientId: { type: 'number' },
      homeClinicId: { type: 'string' },
      firstName: { type: 'string' },
      middleName: { type: 'string' },
      lastName: { type: 'string' },
      language: { type: 'string' },
      gender: { type: 'string' },
      dateOfBirth: { type: 'string' },
      zip: { type: 'string' },
      scratchPad: { type: 'text' },
      consentToCall: { type: 'boolean' },
      consentToText: { type: 'boolean' },
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

  static async get(patientId: string): Promise<Patient> {
    const patient = await this.query().findById(patientId);

    if (!patient) {
      return Promise.reject(`No such patient: ${patientId}`);
    }
    return patient;
  }

  static async getAll({
    pageNumber,
    pageSize,
  }: IPaginationOptions): Promise<IPaginatedResults<Patient>> {
    const patientsResult = (await this.query().page(pageNumber, pageSize)) as any;

    return {
      results: patientsResult.results,
      total: patientsResult.total,
    };
  }

  static async getBy(fieldName: GetByOptions, field?: string): Promise<Patient | null> {
    if (!field) {
      return null;
    }

    const patient = await this.query()
      .where(fieldName, field)
      .first();

    if (!patient) {
      return null;
    }
    return patient;
  }

  static async setup(input: IPatientEditableFields, userId: string, existingTxn?: Transaction) {
    return await transaction(Patient.knex(), async txn => {
      const adminConcern = await Concern.findOrCreateByTitle(
        adminTasksConcernTitle,
        existingTxn || txn,
      );
      const patient = await this.query(existingTxn || txn).insertAndFetch(input);

      // TODO: once we actually figure out our patient onboarding flow, let's move to the resolver
      await PatientConcern.create(
        {
          concernId: adminConcern.id,
          patientId: patient.id,
          userId,
          startedAt: new Date().toISOString(),
        },
        existingTxn || txn,
      );

      return patient;
    });
  }

  static async edit(patient: IEditPatient, patientId: string): Promise<Patient> {
    return await this.query().updateAndFetchById(patientId, patient);
  }

  // limit accidentally editing the athenaPatientId by only allowing it explicitly here
  static async addAthenaPatientId(
    athenaPatientId: number,
    patientId: string,
    txn?: Transaction,
  ): Promise<Patient> {
    return this.query(txn).updateAndFetchById(patientId, { athenaPatientId });
  }

  static async execWithTransaction(
    callback: (boundModelClass: typeof Patient) => Promise<Patient>,
  ) {
    return await transaction(this as any, callback);
  }
}
/* tslint:enable:member-ordering */
