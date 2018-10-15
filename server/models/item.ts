import { Model, Transaction, RelationMappings } from 'objection';
import Pokemon from './pokemon';
import uuid from 'uuid/v4';

export interface IItemCreateInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface IItemEditInput {
  name?: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

export default class Item extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  name!: string;
  pokemonId!: string;
  pokemon!: Pokemon;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'item';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      name: { type: 'string' },
      pokemonId: { type: 'string' },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['name', 'pokemonId', 'price', 'happiness', 'imageUrl'],
  };

  static get relationMappings(): RelationMappings {
    return {
      pokemon: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pokemon,
        join: {
          from: 'item.pokemonId',
          to: 'pokemon.id',
        },
      },
    };
  }

  static async create(input: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn).findOne({ id: itemId, deletedAt: null });

    if (!item) {
      return Promise.reject(`No such item: ${itemId}`);
    }
    return item;
  }

  static async getAll(txn: Transaction): Promise<Item[]> {
    return this.query(txn).where({ deletedAt: null });
  }

  static async edit(itemId: string, input: IItemEditInput, txn: Transaction): Promise<Item> {
    const editedItem = await this.query(txn).patchAndFetchById(itemId, input);

    if (!editedItem) {
      return Promise.reject(`item: ${itemId} does not exist`);
    }

    return editedItem;
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const byeItem = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString(),
    });

    if (!byeItem) {
      return Promise.reject(`item: ${itemId} does not exist`);
    }

    return byeItem;
  }
}
