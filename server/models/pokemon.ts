import { Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Item from './item';

export interface IPokemonCreateInput {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: JSON | string;
  imageUrl: string;
}

export interface IPokemonEditInput {
  pokemonNumber?: number;
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: JSON | string;
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
      id: { type: ['string', 'null'] },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'string' },
      moves: { type: ['JSON', 'string'] },
      imageUrl: { type: 'string' },
      createdAt: { type: ['string', 'null'] },
      updatedAt: { type: ['string', 'null'] },
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['pokemonNumber', 'name', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
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
      return pokemon;
    }
    return Promise.reject(`Could not finish query and join relation with pokemon id: ${pokemonId}`);
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    const pokemonExists = await this.query(txn)
      .where({ pokemonNumber: input.pokemonNumber })
      .where({ deletedAt: null })
      .count();
    if (Number(pokemonExists) > 0) {
      return Promise.reject(
        `Found an existing pokemon with pokemon number: ${input.pokemonNumber}`,
      );
    }
    return this.query(txn).insertAndFetch(input);
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
  moves!: JSON | string;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;
  items!: Item[] | [];

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
