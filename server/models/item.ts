import { Model, Transaction } from 'objection';

import uuid from 'uuid/v4';

export interface IItemCreateFields {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IItemEditInput {
  name?: string;
  pokemonNumber?: number;
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

const errorMsg = (id: string) => `item with id ${id} not found.`;

export default class Item extends Model {
  static tableName = 'item';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static async create(input: IItemCreateFields, txn: Transaction): Promise<Item> {
    return this.query(txn).insertAndFetch(input);
  }
  static async getAll(txn: Transaction): Promise<Item[]> {
    const allItems = await this.query(txn)
      .orderBy('createdAt', 'DESC')
      .whereNull('deletedAt');
    return allItems;
  }
  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn)
      .findById(itemId)
      .whereNull('deletedAt');

    if (!item) {
      return Promise.reject(errorMsg(itemId));
    }
    return item;
  }

  static async edit(
    itemId: string,
    itemFields: Partial<IItemEditInput>,
    txn: Transaction,
  ): Promise<Item> {
    const editedItem = await this.query(txn).updateAndFetchById(itemId, itemFields);
    if (!editedItem) {
      return Promise.reject(errorMsg(itemId));
    }
    return editedItem;
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const itemToDelete = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString(),
    });
    if (!itemToDelete) {
      return Promise.reject(errorMsg(itemId));
    }
    return itemToDelete;
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
  [k: string]: any;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
