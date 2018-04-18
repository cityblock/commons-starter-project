import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import { validatePhoneNumberForTwilio } from '../helpers/twilio-helpers';
import BaseModel from './base-model';
import Patient from './patient';
import PatientPhone from './patient-phone';
import { Direction, DIRECTION } from './sms-message';
import User from './user';

type CallStatus =
  | 'completed'
  | 'busy'
  | 'no-answer'
  | 'failed'
  | 'canceled'
  | 'queued'
  | 'ringing'
  | 'in-progress';
const CALL_STATUS: CallStatus[] = [
  'completed',
  'busy',
  'no-answer',
  'failed',
  'canceled',
  'queued',
  'ringing',
  'in-progress',
];

interface IPhoneCallCreate {
  userId: string;
  contactNumber: string;
  direction: Direction;
  callStatus: CallStatus;
  duration: number;
  twilioPayload: object;
  callSid: string;
}

interface IPhoneCallUpdate {
  voicemailUrl: string;
  voicemailPayload: object;
}

interface IGetForUserPatientParams {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class PhoneCall extends BaseModel {
  userId: string;
  user: User;
  contactNumber: string;
  patientId: string | null;
  patient: Patient | null;
  direction: Direction;
  callStatus: CallStatus;
  duration: number;
  twilioPayload: object;
  callSid: string;
  voicemailUrl: string | null;
  voicemailPayload: object | null;

  static tableName = 'phone_call';

  // Not using for now as we will validate through patient model
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      contactNumber: { type: 'string', minLength: 12, maxLength: 12 },
      patientId: { type: ['string', 'null'], format: 'uuid' },
      direction: { type: 'string', enum: DIRECTION },
      callStatus: { type: 'string', enum: CALL_STATUS },
      duration: { type: 'integer', minimum: 0 },
      twilioPayload: { type: 'json' },
      callSid: { type: 'string', minLength: 34, maxLength: 34 },
      voicemailUrl: { type: ['string', 'null'] },
      voicemailPayload: { type: 'json' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: [
      'userId',
      'contactNumber',
      'direction',
      'callStatus',
      'duration',
      'twilioPayload',
      'callSid',
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      user: {
        relation: Model.BelongsToOneRelation,
        modelClass: User,
        join: {
          from: 'phone_call.userId',
          to: 'user.id',
        },
      },
      patient: {
        relation: Model.BelongsToOneRelation,
        modelClass: Patient,
        join: {
          from: 'phone_call.patientId',
          to: 'patient.id',
        },
      },
    };
  }

  static async create(input: IPhoneCallCreate, txn: Transaction): Promise<PhoneCall> {
    await validatePhoneNumberForTwilio(input.contactNumber);
    // grab patient id currently associated with that number if it exsits
    const patientId = await PatientPhone.getPatientIdForPhoneNumber(input.contactNumber, txn);

    const inputWithPatient = {
      ...input,
      patientId,
    };
    return this.query(txn).insertAndFetch(inputWithPatient);
  }

  static async getForUserPatient(
    { userId, patientId }: IGetForUserPatientParams,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<PhoneCall>> {
    const phoneCalls = (await this.query(txn)
      .where({ patientId, userId, deletedAt: null })
      .orderBy('createdAt', 'DESC')
      .page(pageNumber, pageSize)) as any;

    return {
      results: phoneCalls.results,
      total: phoneCalls.total,
    };
  }

  static async getByCallSid(callSid: string, txn: Transaction): Promise<PhoneCall | null> {
    const phoneCall = await this.query(txn).findOne({ callSid, deletedAt: null });

    return phoneCall || null;
  }

  static async update(
    phoneCallId: string,
    phoneCall: IPhoneCallUpdate,
    txn: Transaction,
  ): Promise<PhoneCall> {
    return this.query(txn).patchAndFetchById(phoneCallId, phoneCall);
  }
}
/* tslint:enable:member-ordering */
