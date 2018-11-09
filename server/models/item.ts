import { Model, Transaction } from 'objection';

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
}