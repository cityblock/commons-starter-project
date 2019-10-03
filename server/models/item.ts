const { Model } = require('objection');
import { Pokemon } from './pokemon';
import { Transaction } from 'objection';

interface IItemCreateInput {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface IItemEditInput {
  price?: number;
  happiness?: number;
  imageUrl?: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Item extends Model {
  static get tableName() {
    return 'item';
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      pokemonId: { type: 'string' },
      price: { type: 'number' },
      happines: { type: 'number' },
      imageUrl: { type: 'string' },
      createdAt: { type: 'Date' },
      updatedAt: { type: 'Date' },
      deletedAt: { type: 'Date' },
    },
    required: [
      'id',
      'name',
      'pokemonId',
      'price',
      'happiness',
      'imageUrl',
      'createdAt',
      'updatedAt',
    ],
  };

  static get relationshipMappings() {
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

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = this.query().findOne({ id: itemId });
    if (!item) {
      return Promise.reject(`No such item: ${itemId}`);
    }
    return item;
  }

  static async getAll(txn: Transaction): Promise<Item[]> {
    return this.query(txn);
  }

  static async create(input: IItemCreateInput, txn: Transaction): Promise<Item> {
    const createdItem = this.query(txn).insertAndFetch(input);
    if (!createdItem) {
      return Promise.reject(`Could not create Item, please try again.`);
    }
    return createdItem;
  }

  static async edit(itemId: string, item: IItemEditInput, txn: Transaction): Promise<Item> {
    const editedItem = this.query(txn).patchAndFetchById(itemId, item);
    if (!editedItem) {
      return Promise.reject(`No such item: ${itemId}`);
    }
    return editedItem;
  }

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    await this.query(txn)
      .where({ id: itemId, deletedAt: null })
      .patch({ deletedAt: new Date() });

    const deletedItem = this.query(txn).findById(itemId);
    if (!deletedItem) {
      return Promise.reject(`No such item: ${itemId}`);
    }
    return deletedItem;
  }

  static async getNonDeletedItem(txn: Transaction): Promise<Item> {
    return this.query(txn)
      .where({ deletedAt: null })
      .limit(1);
  }
}
