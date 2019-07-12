import { QueryBuilder, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';

const EAGER_QUERY = `[
  item
]`;

export interface IPokemon {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
}

export interface IPokemonCreate {
  name: string;
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

export default class Pokemon extends BaseModel {
  static async get(): Promise<Pokemon[] | null[]> {
    const pokemon = await this.query().orderBy('pokemonId');
    if (!pokemon) {
      return Promise.reject('No pokemon in db');
    }
    return pokemon;
  }

  static async getOne(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findOne({
        id: pokemonId,
        deletedAt: null,
      })
      .eager(EAGER_QUERY)
      .where({ pokemonId })
      .findById(pokemonId);
    if (!pokemon) {
      return Promise.reject(`No such partner: ${pokemonId}`);
    }
    return pokemon;
  }

  // create
  static async create(pokemon: IPokemon, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insert(pokemon);
  }

  // edit

  // delete

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string;
  imageUrl!: string;
}
