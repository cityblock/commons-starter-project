import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Pokemon from './pokemon';

export interface IItemCreateInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export interface IItemEditInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export default class Item extends BaseModel {
  static tableName = 'item';

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

  static async getById(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn)
      .findOne({
        id: itemId,
        deletedAt: null,
      })
      .where({ itemId })
      .findById(itemId);
    if (!item) {
      return Promise.reject(`No such itemId with id: ${itemId}`);
    }
    return item;
  }

  static async getByName(itemName: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn).findOne({
      name: itemName,
      deletedAt: null,
    });
    if (!item) {
      return Promise.reject(`No such item with name: ${itemName}`);
    }
    return item;
  }

  static async create(item: IItemCreateInput, txn: Transaction): Promise<Item> {
    const itemExists = await this.getByName(item.name, txn);
    if (!itemExists) {
      return this.query(txn).insert(item);
    }
    return Promise.reject(`Error:  ${item.name} already exists.`);
  }

  static async edit(itemId: string, pokemon: IItemEditInput, txn: Transaction): Promise<Item> {
    const exists = await this.getById(itemId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(itemId, pokemon);
    }
    return Promise.reject(`Error: couldn't update ${pokemon.name}'s item`);
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const exists = await this.getById(itemId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(itemId, {
        deletedAt: new Date(Date.now()).toISOString(),
      });
    }
    return Promise.reject(`Error: couldn't delete Item (ID): ${itemId}`);
  }

  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
}
