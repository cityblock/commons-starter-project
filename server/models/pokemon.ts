import { Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Item from './item';

export interface IPokemonCreateInput {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: JSON;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface IPokemonEditInput {
  pokemonNumber?: number;
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: JSON;
  imageUrl?: string;
}

export default class Pokemon extends Model {
  static get relationMappings(): RelationMappings {
    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId',
        },
      },
    };
  }
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static tableName = 'pokemon';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'string' },
      moves: { type: 'JSON' },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: [
      'id',
      'pokemonNumber',
      'name',
      'attack',
      'defense',
      'pokeType',
      'moves',
      'imageUrl',
      'createdAt',
      'updatedAt',
    ],
  };

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn).orderBy('pokemonNumber');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .eager('items')
      .findById(pokemonId)
      .leftJoinRelation('items');
    if (pokemon) {
      return pokemon as any;
    }
    return Promise.reject(`Could not finish query and join relation with pokemon id: ${pokemonId}`);
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    const dbReadyInput = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...input,
    };
    const pokemonExists = await this.query(txn)
      .where({ pokemonNumber: dbReadyInput.pokemonNumber })
      .where({ deletedAt: null })
      .count();
    if (Number(pokemonExists) > 0) {
      return Promise.reject(
        `Found an existing pokemon with pokemon number: ${dbReadyInput.pokemonNumber}`,
      );
    }
    return this.query(txn).insertAndFetch(dbReadyInput);
  }

  static async edit(
    pokemonId: string,
    pokemon: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const pokemonExists = await this.query(txn)
      .findById(pokemonId)
      .count();
    if (Number(pokemonExists) === 0) {
      return Promise.reject(`Can't find an existing pokemon with id: ${pokemonId}`);
    }
    return this.query(txn).patchAndFetchById(pokemonId, pokemon);
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemonExists = await this.query(txn)
      .findById(pokemonId)
      .where({ deletedAt: null })
      .count();
    if (Number(pokemonExists) === 0) {
      return Promise.reject(`Can't find an existing pokemon with id: ${pokemonId}`);
    }
    return this.query(txn).patchAndFetchById(pokemonId, { deletedAt: new Date().toISOString() });
  }

  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: string;
  moves!: JSON;
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
}
