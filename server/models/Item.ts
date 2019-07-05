import { Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid';
import Pokemon from './Pokemon';

/*
  - id (primary key, uuid, not null, unique)
  - name (string, not null)
  - pokemonId (foreign key, uuid, not null) ­ points to which Pokemon the item belongs to. You can find an example of [this in this Commons migration folder](https://github.com/cityblock/commons/blob/master/server/models/migrations/20180417100700_create-phone-call.js).
  - price (integer, not null)
  - happiness (integer, not null)
  - imageUrl (string, not null)
  - createdAt (timestamp, default to the current time)
  - updatedAt (timestamp, default to the current time)
  - deletedAt (timestamp, nullable)
*/

// Interfaces
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
  // Table
  static tableName = 'item';

  // Schema
  static jsonSchema = {
    type: 'object',
    required: ['name'],

    properties: {
      id: { type: 'uuid' },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      pokemonId: { type: 'uuid' },
      price: { type: 'integer' },
      happiness: { type: 'integer' },
      imageUrl: { type: 'string', minLength: 1, maxLength: 255 },
      createdAt: { type: 'timestamp' },
      updatedAt: { type: 'timestamp' },
      deletedAt: { type: 'timestamp' },
    },
  };

  static modelPaths = [__dirname];

  // Relationships
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

  // Custom methods

  // Returns a single item
  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const individualItem = await this.query(txn).findById(itemId);

    // No data, just reject
    if (!individualItem) return Promise.reject();

    return individualItem;
  }

  // Creates and returns an item
  static async create(item: IItemCreateInput, txn: Transaction): Promise<Item> {
    const createdItem = await this.query(txn).insertAndFetch(item);
    return createdItem;
  }

  // Edits an existing item
  static async edit(itemId: string, item: IItemEditInput, txn: Transaction): Promise<Item> {
    const editedItem = await this.query(txn).patchAndFetchById(itemId, item);
    return editedItem;
  }

  // Marks an item as deleted, but does not actually delete it from the database
  static async delete(itemId: string, txn: Transaction): Promise<Item> {
    const deletedItem = await this.query(txn).patchAndFetchById(itemId, { deletedAt: new Date() });
    return deletedItem;
  }

  // Public Properties
  id!: string;
  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  // Lifecycle
  $beforeInsert() {
    this.id = uuid.v4();
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
