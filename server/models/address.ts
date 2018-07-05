import { Transaction } from 'objection';
import BaseModel from './base-model';

export interface IAddressOptions {
  updatedById: string;
  zip?: string | null;
  street1?: string | null;
  street2?: string | null;
  state?: string | null;
  city?: string | null;
  description?: string | null;
}

/* tslint:disable:member-ordering */
export default class Address extends BaseModel {
  street1!: string | null;
  street2!: string | null;
  zip!: string | null;
  state!: string | null;
  city!: string | null;
  description!: string | null;
  updatedById!: string;

  static tableName = 'address';

  static hasPHI = false;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      street1: { type: ['string', 'null'] }, // Cannot set a min-length here because of attribution data, unfortunately
      street2: { type: ['string', 'null'] },
      zip: { type: ['string', 'null'] },
      state: { type: ['string', 'null'], minLength: 2, maxLength: 2 },
      city: { type: ['string', 'null'] },
      description: { type: ['string', 'null'] },
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
