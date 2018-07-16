import { Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Pokemon from './pokemon';

interface IItemCreateFields {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

interface IItemEditFields {
  name?: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

/* tslint:disable member-ordering */
export default class Item extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;
  static tableName = 'item';

  id!: string;
  name!: string;
  pokemonId!: string;
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

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string', minLength: 1 },
      pokemonId: { type: 'string', format: 'uuid' },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'string', minLength: 1 },
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

  static async create(input: IItemCreateFields, txn: Transaction): Promise<Item> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn).findOne({ id: itemId, deletedAt: null });
    if (!item) {
      return Promise.reject(`No such item exists: ${itemId}`);
    }
    return item;
  }

  static async getAll(txn: Transaction): Promise<Item[]> {
    return this.query(txn)
      .where({ deletedAt: null })
      .orderBy('name', 'ASC');
  }

  static async edit(itemId: string, input: IItemEditFields, txn: Transaction): Promise<Item> {
    const updatedItem = await this.query(txn).patchAndFetchById(itemId, input);

    if (!updatedItem) {
      return Promise.reject(`No such item exists: ${updatedItem}`);
    }
    return updatedItem;
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const deletedItem = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString(),
    });

    if (!deletedItem) {
      return Promise.reject(`No such item: ${deletedItem}`);
    }
    return deletedItem;
  }
}
/* tslint:enable member-ordering */
