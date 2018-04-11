import { Transaction } from 'objection';
import {
  formatPhoneNumberForTwilio,
  validatePhoneNumberForTwilio,
} from '../helpers/twilio-helpers';
import BaseModel from './base-model';

export interface IPhoneOptions {
  phoneNumber: string;
}

// Used in phone related join tables
export type PhoneType = 'home' | 'work' | 'mobile' | 'other';
export const PHONE_TYPES = ['home', 'work', 'mobile', 'other'];

/* tslint:disable:member-ordering */
export default class Phone extends BaseModel {
  phoneNumber: string;

  static tableName = 'phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      phoneNumber: { type: 'string', minLength: 12, maxLength: 12 },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['phoneNumber'],
  };

  static async get(phoneId: string, txn: Transaction) {
    const phone = await this.query(txn).findOne({ id: phoneId, deletedAt: null });

    if (!phone) {
      return Promise.reject(`No such phone: ${phoneId}`);
    }

    return phone;
  }

  static async create(input: IPhoneOptions, txn: Transaction) {
    const formattedInput = {
      ...input,
      phoneNumber: input.phoneNumber ? formatPhoneNumberForTwilio(input.phoneNumber) : undefined,
    };
    await validatePhoneNumberForTwilio(formattedInput.phoneNumber);

    return this.query(txn).insertAndFetch(formattedInput);
  }

  static async delete(phoneId: string, txn: Transaction) {
    await this.query(txn)
      .where({ id: phoneId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(phoneId);

    if (!deleted) {
      return Promise.reject(`No such phone: ${phoneId}`);
    }

    return deleted;
  }
}
/* tslint:enable:member-ordering */
