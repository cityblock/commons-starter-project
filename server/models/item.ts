import { Model, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';

export interface IItemCreateInput {
  name?: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

export default class Item extends Model {
  static tableName = 'item';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      pokemonId: { type: 'string', format: 'uuid' },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'imageUrl' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['name', 'pokemonId', 'price', 'happiness', 'imageUrl'],
  };

  static async create(input: IItemCreateInput, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(itemId: string, txn: Transaction) {
    const item = await this.query(txn).findById(itemId);
    if (!item) return Promise.reject(`could not find item with id: ${itemId}`);
    else return item;
  }

  static async edit(itemId: string, item: IItemCreateInput, txn: Transaction) {
    const updatedItem = await this.query(txn).patchAndFetchById(itemId, item);
    if (!updatedItem) return Promise.reject(`could not update item with id: ${itemId}`);
    else return updatedItem;
  }

  static async delete(itemId: string, txn: Transaction) {
    const item = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString(),
    });
    if (!item) return Promise.reject(`could not mark as deleted item with id: ${itemId}`);
    else return item;
  }

  id!: string;
  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  $beforeDelete() {
    this.deletedAt = new Date().toISOString();
  }
}
