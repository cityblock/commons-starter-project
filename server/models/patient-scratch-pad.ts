import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';
import User from './user';

const MAX_LENGTH = 1400;

interface IPatientScratchPadCreateFields {
  patientId: string;
  userId: string;
}

interface IPatientScratchPadEditFields {
  body: string;
}

/* tslint:disable:member-ordering */
// Patient scratch pad
export default class PatientScratchPad extends BaseModel {
  patientId: string;
  userId: string;
  body: string;
  patient: Patient;
  user: User;

  static tableName = 'patient_scratch_pad';

  static hasPHI = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      userId: { type: 'string', format: 'uuid' },
      body: { type: 'string', maxLength: MAX_LENGTH },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'userId'],
  };

  static relationMappings: RelationMappings = {
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'patient_scratch_pad.patientId',
        to: 'patient.id',
      },
    },
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'patient_scratch_pad.userId',
        to: 'user.id',
      },
    },
  };

  static async create(
    { patientId, userId }: IPatientScratchPadCreateFields,
    txn: Transaction,
  ): Promise<PatientScratchPad> {
    return this.query(txn).insertAndFetch({ patientId, userId });
  }

  static async getForPatientAndUser(
    { patientId, userId }: IPatientScratchPadCreateFields,
    txn: Transaction,
  ): Promise<PatientScratchPad | null> {
    const patientScratchPad = await this.query(txn).findOne({ patientId, userId });

    return patientScratchPad || null;
  }

  static async update(
    patientScratchPadId: string,
    { body }: IPatientScratchPadEditFields,
    txn: Transaction,
  ): Promise<PatientScratchPad> {
    return this.query(txn).patchAndFetchById(patientScratchPadId, { body });
  }

  static async getPatientIdForResource(
    patientScratchPadId: string,
    txn: Transaction,
  ): Promise<string> {
    const result = await this.query(txn)
      .where({ deletedAt: null })
      .findById(patientScratchPadId);

    return result ? result.patientId : '';
  }
}
/* tslint:enable:member-ordering */
