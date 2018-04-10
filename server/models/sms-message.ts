import { Model, RelationMappings, Transaction } from 'objection';
import { IPaginatedResults, IPaginationOptions } from '../db';
import BaseModel from './base-model';
import PatientPhone from './patient-phone';
import Phone from './phone';
import User from './user';

type Direction = 'inbound' | 'outbound';
const DIRECTION: Direction[] = ['inbound', 'outbound'];

interface ISmsMessageCreate {
  userId: string;
  phoneId: string;
  direction: Direction;
  body: string;
  mediaUrls: string | null;
  twilioMessageSid: string;
}

interface IGetForUserPatientParams {
  userId: string;
  patientId: string;
}

/* tslint:disable:member-ordering */
export default class SmsMessage extends BaseModel {
  userId: string;
  user: User;
  phoneId: string;
  phone: Phone;
  direction: Direction;
  body: string;
  mediaUrls: string | null;
  twilioMessageSid: string;

  static tableName = 'sms_message';

  // Not using for now as we will validate through patient model
  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      userId: { type: 'string', format: 'uuid' },
      phoneId: { type: 'string', format: 'uuid' },
      direction: { type: 'string', enum: DIRECTION },
      body: { type: 'string', minLength: 1 }, // cannot be blank
      mediaUrls: { type: ['string', 'null'] },
      twilioMessageSid: { type: 'string', minLength: 34, maxLength: 34 },
      seenAt: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
    },
    required: ['userId', 'phoneId', 'direction', 'body', 'twilioMessageSid'],
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
    phone: {
      relation: Model.BelongsToOneRelation,
      modelClass: 'phone',
      join: {
        from: 'sms_message.phoneId',
        to: 'phone.id',
      },
    },
  };

  static async create(input: ISmsMessageCreate, txn: Transaction): Promise<SmsMessage> {
    return this.query(txn).insertAndFetch(input);
  }

  static async getForUserPatient(
    { userId, patientId }: IGetForUserPatientParams,
    { pageNumber, pageSize }: IPaginationOptions,
    txn: Transaction,
  ): Promise<IPaginatedResults<SmsMessage>> {
    const patientPhoneIds = PatientPhone.query(txn)
      .where({ patientId })
      .select('phoneId');

    const messages = (await this.query(txn)
      .whereIn('phoneId', patientPhoneIds)
      .andWhere({ userId, deletedAt: null })
      .orderBy('createdAt', 'DESC')
      .page(pageNumber, pageSize)) as any;

    return {
      results: messages.results,
      total: messages.total,
    };
  }
}
/* tslint:enable:member-ordering */
