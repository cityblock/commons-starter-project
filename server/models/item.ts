import { Model, RelationMappings, Transaction } from 'objection';
import Pokemon from './pokemon';

export interface IItemCreateInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IItemEditInput {
  name?: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

export default class Item extends Model {
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
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

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
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: [
      'id',
      'name',
      'pokemonId',
      'price',
      'happiness',
      'imageUrl',
      'imageUrl',
      'createdAt',
      'updatedAt',
    ],
  };

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const pokemon = await this.query(txn).findById(itemId);
    if (pokemon) {
      return pokemon as any;
    }
    return Promise.reject(`Could not find an item with id: ${itemId}`);
  }

  static async create(input: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insertAndFetch(input);
  }

  static async edit(itemId: string, item: IItemEditInput, txn: Transaction): Promise<Item> {
    const itemExists = await this.query(txn).findById(itemId);
    if (!itemExists) {
      return Promise.reject(`Can't find an existing item to edit with id: ${itemId}`);
    }
    return this.query(txn).patchAndFetchById(itemId, item);
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const itemExists = await this.query(txn)
      .findById(itemId)
      .where({ deletedAt: null });
    if (!itemExists) {
      return Promise.reject(
        `Can't find an existing item with id, or it has already been deleted: ${itemId}`,
      );
    }
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

  $beforeInsert() {
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
