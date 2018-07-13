import { Model, Transaction } from 'objection';
import uuid from 'uuid/v4';

type PokeType =
  | 'normal'
  | 'grass'
  | 'fire'
  | 'water'
  | 'electric'
  | 'psychic'
  | 'ghost'
  | 'dark'
  | 'fairy'
  | 'rock'
  | 'ground'
  | 'steel'
  | 'flying'
  | 'fighting'
  | 'bug'
  | 'ice'
  | 'dragon'
  | 'poison';

interface IPokemonCreateFields {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

interface IPokemonUpdateFields {
  pokemonId: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

/* tslint:disable member-ordering */
export default class Pokemon extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'pokemon';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'PokeType' },
      moves: { type: 'string[]' },
      imageUrl: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['pokemonNumber', 'name', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
  };

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    const formattedInput = {
      ...input,
      moves: JSON.stringify(input.moves) as any,
    };
    return this.query(txn).insertAndFetch(formattedInput);
  }

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn).orderBy('pokemonNumber', 'ASC');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn).findById(pokemonId);
    return pokemon;
  }

  static async edit(pokemonId: string, input: IPokemonUpdateFields, txn: Transaction) {
    const updatedPokemon = await this.query(txn).patchAndFetchById(pokemonId, input);
    return updatedPokemon;
  }

  // static async create() {}
  // static async edit() {}
  // static async delete() {}
}

/* tslint:enable member-ordering */
