import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Patient from './patient';

export type DisenrollmentType =
  | 'transferPlan'
  | 'moved'
  | 'dissatisfied'
  | 'ineligible'
  | 'deceased'
  | 'other';

export const DISENROLLMENT_TYPES: DisenrollmentType[] = [
  'transferPlan',
  'moved',
  'dissatisfied',
  'ineligible',
  'deceased',
  'other',
];

interface IPatientDisenrollmentCreate {
  patientId: string;
  reason: DisenrollmentType;
  note?: string;
}

/* tslint:disable:member-ordering */
export default class PatientDisenrollment extends BaseModel {
  patientId!: string;
  reason!: DisenrollmentType;
  note!: string | null;

  static tableName = 'patient_disenrollment';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      patientId: { type: 'string', format: 'uuid' },
      reason: { type: 'string', enum: DISENROLLMENT_TYPES },
      note: { type: 'string', minLength: 1 }, // cannot be blank
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['patientId', 'reason'],
  };

  static get relationMappings(): RelationMappings {
    return {
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'patient_disenrollment.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async create(
    patientDisenrollment: IPatientDisenrollmentCreate,
    txn: Transaction,
  ): Promise<PatientDisenrollment> {
    if (patientDisenrollment.reason === 'other' && !patientDisenrollment.note) {
      return Promise.reject('Must include note if disenrolling for other reason');
    }

    return this.query(txn).insertAndFetch(patientDisenrollment);
  }

  static async getForPatient(
    patientId: string,
    txn: Transaction,
  ): Promise<PatientDisenrollment | null> {
    const patientDisenrollment = await this.query(txn).findOne({ patientId });

    return patientDisenrollment || null;
  }
}
/* tslint:enable:member-ordering */
