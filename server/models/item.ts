import { Transaction } from 'objection';
import BaseModel from './base-model';

// is there any reason here why we would not want the create interface to inherit from the edit interface?
interface IItemCreateInput {
  id: string;
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

interface IItemEditInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

/*tslint:disable:member-ordering*/
export default class Item extends BaseModel {
  id!: string;
  pokemonId!: string;
  name!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;

  static tableName = 'item';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonId: { type: 'string' },
      name: { type: 'string', minLength: 1 },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['id', 'pokemonId', 'name', 'price', 'happiness', 'imageUrl', 'createdAt'],
  };

  static async create(item: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insert(item);
  }

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn)
      .findById(itemId)
      .andWhere('item.deletedAt', null);

    if (!item) {
      return Promise.reject(`No such item in your poket with ${itemId}`);
    }

    return item;
  }

  static async delete(itemId: string, txn: Transaction) {
    await Item.query(txn)
      .findById(itemId)
      .patch({ deletedAt: new Date().toISOString() });
  }

  static async edit(
    itemId: string,
    itemEditInput: IItemEditInput,
    txn: Transaction,
  ): Promise<Item> {
    const editedItem = await this.query(txn).patchAndFetchById(itemId, itemEditInput);

    return editedItem;
  }
}
/*tslint:disable:member-ordering*/

/*
DONE ● getAll(txn: Transaction) ­ returns all Pokemon, ordered by pokemonNumber ascending
--> test: check that it returned something, test that it returns the table length?
DONE● get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated
items
--> test: it returns a single pokemon
--> test that it returned the length of items associated with that poke
DONE● create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
--> test that it generated one pokemon
--> test that it returned just one pokemon
● edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an
existing Pokemon
--> test that it edited just one pokemon
● delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not
actually delete it from the database
--> test that it marked the poke as deleted
*/
