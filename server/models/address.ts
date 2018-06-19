import { Transaction } from 'objection';
import BaseModel from './base-model';

export interface IAddressOptions {
  updatedById: string;
  zip?: string;
  street1?: string;
  street2?: string;
  state?: string;
  city?: string;
  description?: string;
}

/* tslint:disable:member-ordering */
export default class Address extends BaseModel {
  street1!: string;
  street2!: string;
  zip!: string;
  state!: string;
  city!: string;
  description!: string;
  updatedById!: string;

  static tableName = 'address';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      street1: { type: 'string', minLength: 1 },
      street2: { type: 'string' }, // Not sure if we can really set a minLength here
      zip: { type: 'string' },
      state: { type: 'string', minLength: 2, maxLength: 2 },
      city: { type: 'string' },
      description: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
      updatedById: { type: 'string', format: 'uuid' },
    },
    required: ['updatedById'],
  };

  static async get(addressId: string, txn: Transaction) {
    const address = await this.query(txn).findOne({ id: addressId, deletedAt: null });

    if (!address) {
      return Promise.reject(`No such address: ${addressId}`);
    }

    return address;
  }

  static async create(input: IAddressOptions, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async delete(addressId: string, txn: Transaction) {
    await this.query(txn)
      .where({ id: addressId, deletedAt: null })
      .patch({ deletedAt: new Date().toISOString() });

    const deleted = await this.query(txn).findById(addressId);

    if (!deleted) {
      return Promise.reject(`No such address: ${addressId}`);
    }

    return deleted;
  }

  static async edit(
    address: IAddressOptions,
    addressId: string,
    txn: Transaction,
  ): Promise<Address> {
    return this.query(txn).patchAndFetchById(addressId, address);
  }
}
/* tslint:enable:member-ordering */
