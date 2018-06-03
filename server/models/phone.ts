import { Transaction } from 'objection';
import { PhoneTypeOptions } from 'schema';
import {
  formatPhoneNumberForTwilio,
  validatePhoneNumberForTwilio,
} from '../helpers/twilio-helpers';
import BaseModel from './base-model';

export interface IPhoneOptions {
  phoneNumber: string;
  type: PhoneTypeOptions;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Phone extends BaseModel {
  phoneNumber!: string;
  type!: PhoneTypeOptions;
  description!: string | null;

  static tableName = 'phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      phoneNumber: { type: 'string', minLength: 12, maxLength: 12 },
      type: { type: 'string', enum: ['home', 'work', 'mobile', 'other'] },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['phoneNumber', 'type'],
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
      phoneNumber: formatPhoneNumberForTwilio(input.phoneNumber),
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

  static async edit(
    phone: Partial<IPhoneOptions>,
    phoneId: string,
    txn: Transaction,
  ): Promise<Phone> {
    const formattedInput = {
      ...phone,
      phoneNumber: phone.phoneNumber ? formatPhoneNumberForTwilio(phone.phoneNumber) : undefined,
    };
    await validatePhoneNumberForTwilio(formattedInput.phoneNumber);

    return this.query(txn).patchAndFetchById(phoneId, formattedInput);
  }
}
/* tslint:enable:member-ordering */
