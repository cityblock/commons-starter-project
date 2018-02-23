import { Transaction } from 'objection';
import BaseModel from './base-model';

export interface IAddressOptions {
  zip: string;
  updatedById: string;
  street?: string;
  state?: string;
  city?: string;
  description?: string;
}

export interface IAddressEdit {
  updatedById: string;
  zip: string;
  street?: string;
  state?: string;
  city?: string;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Address extends BaseModel {
  street: string;
  zip: string;
  state: string;
  city: string;
  description: string;
  updatedById: string;

  static tableName = 'address';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      street: { type: 'string', minLength: 1 },
      zip: { type: 'string' },
      state: { type: 'string', minLength: 2, maxLength: 2 },
      city: { type: 'string' },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
    },
    required: ['zip', 'updatedById'],
  };

  static async create(input: IAddressOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(address: IAddressEdit, addressId: string, txn: Transaction): Promise<Address> {
    return this.query(txn).patchAndFetchById(addressId, address);
  }
}
/* tslint:enable:member-ordering */
