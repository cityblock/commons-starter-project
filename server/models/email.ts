import { Transaction } from 'objection';
import BaseModel from './base-model';

export interface IEmailOptions {
  updatedBy: string;
  email: string;
  description?: string;
}

export interface IEmailEdit {
  updatedBy: string;
  email: string;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Email extends BaseModel {
  email: string;
  description: string;
  updatedBy: string;

  static tableName = 'email';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      email: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedBy: { type: 'string', format: 'uuid' },
    },
    required: ['email', 'updatedBy'],
  };

  static async create(input: IEmailOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(email: IEmailEdit, emailId: string, txn: Transaction): Promise<Email> {
    return this.query(txn).patchAndFetchById(emailId, email);
  }
}
/* tslint:enable:member-ordering */
