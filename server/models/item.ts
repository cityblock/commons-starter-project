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
  id: string;
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

    if (!item) return Promise.reject(`item with id ${itemId} not found.`);
    return item;
  }

  static async edit(itemId: string, fieldsToUpdate: IItemEditInput, txn: Transaction): Promise<Item> {
    return this.query(txn).updateAndFetchById(itemId, fieldsToUpdate);
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    return this.query(txn).patchAndFetchById(itemId, { deletedAt: new Date().toISOString() });
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