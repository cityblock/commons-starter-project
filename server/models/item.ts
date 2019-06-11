import { Transaction } from 'objection';
import BaseModel from './base-model';
import Pokemon from './pokemon';

// is there any reason here why we would not want the create interface to inherit from the edit interface?
interface IItemCreateInput {
  pokemonId: string;
  name: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

interface IItemEditInput {
  name?: string;
  price?: number;
  happiness?: number;
  imageUrl?: string;
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
    required: ['pokemonId', 'name', 'price', 'happiness', 'imageUrl'],
  };

  static async create(item: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insertAndFetch(item);
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

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const deleted = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString(),
    });
    return deleted;
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
