import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Pokemon from './pokemon';

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

export default class Item extends BaseModel {
  static tableName = 'item';
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
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['name', 'pokemonId', 'price', 'happiness', 'imageUrl'],
  };

  static get relationMappings(): RelationMappings {
    return {
      pokemon: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pokemon,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId',
        },
      },
    };
  }

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn)
      .eager('pokemon')
      .findOne({
        id: itemId,
        deletedAt: null,
      });
    if (!item) {
      return Promise.reject(`No such itemId with id: ${itemId}`);
    }
    return item;
  }

  static async create(item: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn)
      .insert(item)
      .eager('pokemon')
      .returning('*');
  }

  static async edit(itemId: string, pokemon: IItemEditInput, txn: Transaction): Promise<Item> {
    const exists = await this.get(itemId, txn);
    if (exists) {
      return this.query(txn)
        .eager('pokemon')
        .patchAndFetchById(itemId, pokemon);
    }
    return Promise.reject(`Error: couldn't update ${pokemon.name}'s item`);
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const exists = await this.get(itemId, txn);
    if (exists) {
      return this.query(txn)
        .eager('pokemon')
        .patchAndFetchById(itemId, {
          deletedAt: new Date().toISOString(),
        });
    }
    return Promise.reject(`Error: couldn't delete Item (ID): ${itemId}`);
  }

  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  pokemon!: Pokemon;
}
