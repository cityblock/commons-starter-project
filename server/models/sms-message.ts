import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import Patient from './patient';
import PatientPhone from './patient-phone';
import User from './user';

type Direction = 'toUser' | 'fromUser';
const DIRECTION: Direction[] = ['toUser', 'fromUser'];

interface ISmsMessageCreate {
  userId: string;
  contactNumber: string;
  direction: Direction;
  body: string;
  twilioPayload: object;
}

interface IGetForUserPatientParams {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class SmsMessage extends BaseModel {
  userId: string;
  user: User;
  contactNumber: string;
  patientId: string | null;
  patient: Patient | null;
  direction: Direction;
  body: string;
  twilioPayload: object;

  static tableName = 'sms_message';

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
      body: { type: 'string', minLength: 1 }, // cannot be blank
      twilioPayload: { type: 'json' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['userId', 'contactNumber', 'direction', 'body', 'twilioPayload'],
  };

  static relationMappings: RelationMappings = {
    user: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'user',
      join: {
        from: 'sms_message.userId',
        to: 'user.id',
      },
    },
    patient: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'patient',
      join: {
        from: 'sms_message.patientId',
        to: 'patient.id',
      },
    },
  };

  static async create(input: ISmsMessageCreate, txn: Transaction): Promise<SmsMessage> {
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
  ): Promise<IPaginatedResults<SmsMessage>> {
    const messages = (await this.query(txn)
      .where({ patientId, userId, deletedAt: null })
      .orderBy('createdAt', 'DESC')
      .page(pageNumber, pageSize)) as any;

    return {
      results: messages.results,
      total: messages.total,
    };
  }
}
/* tslint:enable:member-ordering */
