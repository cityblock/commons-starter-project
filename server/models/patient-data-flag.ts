import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import User from './user';

interface IPatientDataFlagCreateFields {
  patientId: string;
  userId: string;
  fieldName: string;
  suggestedValue?: string;
}

/* tslint:disable:member-ordering */
export default class PatientDataFlag extends BaseModel {
  patientId: string;
  patient: Patient;
  userId: string;
  user: User;
  fieldName: string;
  suggestedValue: string;

  static tableName = 'patient_data_flag';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', minLength: 1 },
      userId: { type: 'string', minLength: 1 },
      fieldName: { type: 'string', minLength: 1 },
      suggestedValue: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'userId', 'fieldName'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_data_flag.patientId',
        to: 'patient.id',
      },
    },

    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_data_flag.userId',
        to: 'user.id',
      },
    },
  };

  static async create(
    input: IPatientDataFlagCreateFields,
    txn: Transaction,
  ): Promise<PatientDataFlag> {
    // First, mark any existing tags for the same field as deleted
    await this.query(txn)
      .where({ fieldName: input.fieldName, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    // Then, insert and return a new flag
    return this.query(txn).insertAndFetch(input);
  }

  static async get(patientDataFlagId: string, txn: Transaction): Promise<PatientDataFlag> {
    const patientDataFlag = await this.query(txn).findOne({
      id: patientDataFlagId,
      deletedAt: null,
    });

    if (!patientDataFlag) {
      return Promise.reject(`No such patientDataFlag: ${patientDataFlagId}`);
    }

    return patientDataFlag;
  }

  static async getAllForPatient(patientId: string, txn: Transaction): Promise<PatientDataFlag[]> {
    return this.query(txn).where({ patientId, deletedAt: null });
  }

  static async deleteAllForPatient(patientId: string, txn: Transaction): Promise<number> {
    return this.query(txn)
      .where({ patientId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });
  }
}
/* tslint:enable:member-ordering */
