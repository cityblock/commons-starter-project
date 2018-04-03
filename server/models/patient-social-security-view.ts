import { Transaction } from 'objection';
import BaseModel from './base-model';

interface IPatientSocialSecurityViewCreateFields {
  userId: string;
  patientId: string;
  glassBreakId?: string | null;
}

/* tslint:disable:member-ordering */
export default class PatientSocialSecurityView extends BaseModel {
  userId: string;
  patientId: string;
  glassBreakId: string | null;

  static tableName = 'patient_social_security_view';
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      glassBreakId: { type: ['string', 'null'], minLength: 1 }, // cannot store empty string
    },
    required: ['userId', 'patientId'],
  };

  static async create(
    input: IPatientSocialSecurityViewCreateFields,
    txn: Transaction,
  ): Promise<PatientSocialSecurityView> {
    return this.query(txn).insertAndFetch(input);
  }
}

/* tslint:enable:member-ordering */
