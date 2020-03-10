import { Model, Transaction } from 'objection';

export interface IItemCreateInput {
  id: string;
  name: string;
  pokemonId: string;
  price: number;
  happiness: number;
  imageUrl: string;
}

export default class Item extends Model {
  static pickJsonSchemaProperties = true;
  static tableName = 'item';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      name: { type: 'string' },
      pokemonId: { type: 'string', format: 'uuid' },
      price: { type: 'number' },
      happiness: { type: 'number' },
      imageUrl: { type: 'imageUrl' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['name', 'pokemonId', 'price', 'happiness', 'imageUrl'],
  };

  static async create(input: IItemCreateInput, txn: Transaction) {
    return this.query(txn).insertAndFetch(input);
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

  $beforeDelete() {
    this.deletedAt = new Date().toISOString();
  }
}
