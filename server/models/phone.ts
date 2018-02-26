import { Transaction } from 'objection';
import BaseModel from './base-model';

export type PhoneTypeOptions = 'home' | 'work' | 'mobile' | 'other' | null;

export interface IPhoneOptions {
  updatedById: string;
  phoneNumber: string;
  type?: PhoneTypeOptions;
  description?: string;
}

export interface IPhoneEdit {
  updatedById: string;
  phoneNumber: string;
  type?: PhoneTypeOptions;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Phone extends BaseModel {
  phoneNumber: string;
  type: PhoneTypeOptions;
  description: string;
  updatedById: string;

  static tableName = 'phone';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      phoneNumber: { type: 'string', minLength: 1 },
      type: { type: 'string', enum: ['home', 'work', 'mobile', 'other'] },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
    },
    required: ['phoneNumber', 'updatedById'],
  };

  static async create(input: IPhoneOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(phone: IPhoneEdit, phoneId: string, txn: Transaction): Promise<Phone> {
    return this.query(txn).patchAndFetchById(phoneId, phone);
  }
}
/* tslint:enable:member-ordering */