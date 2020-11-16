import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base';
import Pokemon from './pokemon';

export interface IItemInput {
  name: string;
  pokemonId?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
}

export default class Item extends BaseModel {
  static tableName = 'item';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;


  static get relationMappings(): RelationMappings {
    return {
      pokemon: {
        relation: Model.BelongsToOneRelation,
        modelClass: Pokemon,
        join: {
          from: 'item.pokemonId',
          to: 'pokemon.id'
        },
      }
    };
  }

  static async get(itemId: string, txn?: Transaction): Promise<Item> {
    const item = await this.query(txn).findById(itemId);
    if (!item) return Promise.reject('No item with the id ' + itemId);
    return item;
  }

  static async create(input: IItemInput, txn?: Transaction): Promise<Item> {
    return this.query(txn).insert(input as Partial<Item>).returning('*');
  }

  static async edit(itemId: string, item: IItemInput, txn?: Transaction): Promise<Item> {
    const updatedItem = await this.query(txn).patchAndFetchById(itemId, item as Partial<Item>);
    if(!updatedItem) return Promise.reject('No item with the id ' + itemId);
    return updatedItem;
  }

  static async delete(itemId: string, txn?: Transaction): Promise<Item> {
    const deletedItem = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString()
    } as Partial<Item>);

    if (!deletedItem) return Promise.reject('No item with the id ' + itemId);
    return deletedItem;
  }

  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;


}