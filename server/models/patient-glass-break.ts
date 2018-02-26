import { isBefore, subHours } from 'date-fns';
import { Transaction } from 'objection';
import config from '../config';
import BaseModel from './base-model';

interface IPatientGlassBreakCreateFields {
  userId: string;
  patientId: string;
  reason: string;
  note: string | null;
}

/* tslint:disable:member-ordering */
export default class PatientGlassBreak extends BaseModel {
  userId: string;
  patientId: string;
  reason: string;
  note: string | null;

  static tableName = 'patient_glass_break';
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      createdAt: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      patientId: { type: 'string', format: 'uuid' },
      reason: { type: 'string', minLength: 1 }, // cannot be blank
      note: { type: ['string', 'null'], minLength: 1 }, // cannot store empty string
    },
    required: ['userId', 'patientId', 'reason'],
  };

  static async create(
    input: IPatientGlassBreakCreateFields,
    txn: Transaction,
  ): Promise<PatientGlassBreak> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(patientGlassBreakId: string, txn: Transaction): Promise<PatientGlassBreak> {
    const patientGlassBreak = await this.query(txn).findOne({
      id: patientGlassBreakId,
      deletedAt: null,
    });

    if (!patientGlassBreak) {
      return Promise.reject(`No such patient glass break: ${patientGlassBreakId}`);
    }

    return patientGlassBreak;
  }

  static async validateGlassBreak(
    patientGlassBreakId: string,
    userId: string,
    patientId: string,
    txn: Transaction,
  ): Promise<boolean> {
    const glassBreak = await this.query(txn).findOne({
      id: patientGlassBreakId,
      userId,
      patientId,
      deletedAt: null,
    });

    if (
      !glassBreak ||
      isBefore(glassBreak.createdAt, subHours(Date.now(), config.PERMISSIONS_SESSION_IN_HOURS))
    ) {
      return Promise.reject(
        'You must break the glass again to view this patient. Please refresh the page.',
      );
    }

    return true;
  }

  static async getForCurrentUserSession(
    userId: string,
    txn: Transaction,
  ): Promise<PatientGlassBreak[]> {
    return this.query(txn)
      .whereRaw(
        `
        patient_glass_break."createdAt" > now() - interval \'${config.PERMISSIONS_SESSION_IN_HOURS -
          1} hours\'
      `,
      )
      .andWhere({ userId, deletedAt: null })
      .orderBy('createdAt', 'DESC');
  }
}
/* tslint:enable:member-ordering */