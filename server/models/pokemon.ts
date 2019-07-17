import { Model, Transaction } from 'objection';
import uuid from 'uuid/v4';

export interface IPokemonCreateInput {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

export interface IPokemonEditInput {
  pokemonNumber?: number;
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: string[];
  imageUrl?: string;
}

export type PokeType = 
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

export default class Pokemon extends Model {
  static tableName = 'pokemon';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { 
        type: 'string', 
        enum: [
          'normal',
          'grass',
          'fire',
          'water',
          'electric',
          'psychic',
          'ghost',
          'dark',
          'fairy',
          'rock',
          'ground',
          'steel',
          'flying',
          'fighting',
          'bug',
          'ice',
          'dragon',
          'poison'
        ] 
      },
      moves: { type: 'array', items: { type: 'string' } },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] }
    },
    required: [
      'pokemonNumber',
      'name',
      'attack',
      'defense',
      'pokeType',
      'moves',
      'imageUrl'
    ]
  };

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const pokemon = await this.query(txn).orderBy('pokemonNumber');

    if (pokemon) {
      return pokemon;
    } else {
      return Promise.reject('No pokemon in db');
    }
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn).findOne({ id: pokemonId, deletedAt: null });

    if (pokemon) {
      return pokemon;
    } else {
      return Promise.reject('No pokemon with given ID');
    }
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    try {
      const pokemon = await this.query(txn).insert(input).returning('*');
      return pokemon;
    } catch(error) {
      return Promise.reject(`Couldn't create pokemon: ${error}`);
    }
  }

  static async edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction): Promise<void> {
    const updatedPokemon = await this.query(txn).patchAndFetchById(pokemonId, pokemon);

    if (!updatedPokemon) return Promise.reject('No pokemon with given ID');
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<void> {
    const pokemon = await this.query(txn).patchAndFetchById(pokemonId, {
      deletedAt: new Date().toISOString() 
    });

    if (!pokemon) return Promise.reject('No pokemon with given ID');
  }

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
