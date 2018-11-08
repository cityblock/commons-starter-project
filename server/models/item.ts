import { Model, Transaction } from 'objection';

interface IItemCreateFields {
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
  id!: string;
  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt?: string;
}