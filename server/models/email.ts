import { Transaction } from 'objection';
import BaseModel from './base-model';

export interface IEmailOptions {
  updatedById: string;
  emailAddress: string;
  description?: string;
}

export interface IEmailEdit {
  updatedById: string;
  emailAddress: string;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Email extends BaseModel {
  emailAddress: string;
  description: string;
  updatedById: string;

  static tableName = 'email';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      emailAddress: { type: 'string', minLength: 1 },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
    },
    required: ['emailAddress', 'updatedById'],
  };

  static async get(emailId: string, txn: Transaction) {
    const email = await this.query(txn).findOne({ id: emailId, deletedAt: null });

    if (!email) {
      return Promise.reject(`No such email: ${emailId}`);
    }

    return email;
  }

  static async create(input: IEmailOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async delete(emailId: string, txn: Transaction) {
    await this.query(txn)
      .where({ id: emailId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(emailId);

    if (!deleted) {
      return Promise.reject(`No such email: ${emailId}`);
    }

    return deleted;
  }

  static async edit(email: IEmailEdit, emailId: string, txn: Transaction): Promise<Email> {
    return this.query(txn).patchAndFetchById(emailId, email);
  }
}
/* tslint:enable:member-ordering */
