import { Model, Transaction } from 'objection';
import uuid from 'uuid/v4';

interface IItemCreateInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

interface IItemEditInput {
  name?: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

export default class Item extends Model {
  static tableName = 'item';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      pokemonId: { type: 'string', format: 'uuid' },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] }
    },
    required: [
      'name',
      'pokemonId',
      'price',
      'happiness',
      'imageUrl'
    ]
  };

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn).findOne({ id: itemId, deletedAt: null });

    if (item) {
      return item;
    } else {
      return Promise.reject('No item with given ID');
    }
  }

  static async create(input: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insert(input).returning('*');
  }

  static async edit(itemId: string, item: IItemEditInput, txn: Transaction): Promise<void> {
    const updatedItem = await this.query(txn).patchAndFetchById(itemId, item);
    if(!updatedItem) return Promise.reject('No item with given ID');
  }

  static async delete(itemId: string, txn: Transaction): Promise<void> {
    const item = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString() 
    });

    if (!item) return Promise.reject('No item with given ID');
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
}
