import { JsonSchema, Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Pokemon from './pokemon';


export interface IItemInput {
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
};

/* tslint:disable:member-ordering */
export default class Item extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

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

  static tableName = 'item';

  static jsonSchema: JsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 }, // TODO format: 'uuid'
      name: { type: 'string', minLength: 1 },
      pokemonId: { type: 'string', minLength: 1 },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'string', minLength: 1 },
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
    // returns a single item
    const itemResult = await this.query(txn)
      .findOne({ id: itemId, deletedAt: null });

    if (!itemResult) {
      return Promise.reject(`No such item: ${itemId}`);
    }

    return itemResult;
  };

  static async create(input: IItemInput, txn: Transaction): Promise<Item> {
    // creates and returns an item
    return this.query(txn).insertAndFetch(input);
  };

  static async edit(itemId: string, item: Partial<IItemInput>, txn: Transaction): Promise<Item> {
    // edits and returns an existing item
    const itemResult = await this.query(txn)
      .patchAndFetchById(itemId, item);

    if (!itemResult) {
      return Promise.reject(`No such item: ${itemId}`);
    }

    return itemResult;
  };

  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    // marks an item as deleted and returns it, but does not actually delete it from the database
    const deletedAt = new Date().toISOString();
    const itemResult = await this.query(txn)
      .patchAndFetchById(itemId, { deletedAt });

    if (!itemResult) {
      return Promise.reject(`No such item: ${itemId}`);
    }

    return itemResult;
  };

};