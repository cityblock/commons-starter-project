import { Model, Transaction, RelationMappings } from 'objection';
import uuid from 'uuid/v4';
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

export default class Item extends Model {
  static tableName = 'item';
  static modelPaths = [__dirname];
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
      deletedAt: { type: ['string', 'null'] }
    },
    required: [
      'name',
      'pokemonId',
      'price',
      'happiness',
      'imageUrl'
    ]
  };

  static get relationMappings(): RelationMappings {
    return {
      pokemon: {
        relation: Model.HasOneRelation,
        modelClass: Pokemon,
        join: {
          from: 'item.pokemonId',
          to: 'pokemon.id'
        },
        modify: builder => builder.where({ 'pokemon.deletedAt': null })
      }
    };
  }

  static async get(itemId: string, txn: Transaction): Promise<Item> {
    const item = await this.query(txn).eager('pokemon').findOne({ id: itemId, deletedAt: null });

    if (item) {
      return item;
    } else {
      return Promise.reject('No item with given ID');
    }
  }

  static async create(input: IItemCreateInput, txn: Transaction): Promise<Item> {
    return this.query(txn).insert(input).returning('*').eager('pokemon');
  }

  static async edit(itemId: string, item: IItemEditInput, txn: Transaction): Promise<void> {
    const updatedItem = await this.query(txn).patchAndFetchById(itemId, item);
    if(!updatedItem) return Promise.reject('No item with given ID');
  }

  static async delete(itemId: string, txn: Transaction): Promise<void> {
    const item = await this.query(txn).patchAndFetchById(itemId, {
      deletedAt: new Date().toISOString() 
    });

    if (!item) return Promise.reject('No item with given ID');
  }

  id!: string;
  name!: string;
  pokemonId!: string;
  price!: number;
  happiness!: number;
  imageUrl!: string;
  pokemon!: Pokemon | null;
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
}
