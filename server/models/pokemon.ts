import { Transaction } from 'objection';
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
  deletedAt: string | null;
}

export interface IPokemonCreate {
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string;
  imageUrl: string;
}

export interface IPokemonEditInput {
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string;
  imageUrl: string;
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

  static async getById(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findOne({
        id: pokemonId,
        deletedAt: null,
      })
      .eager(EAGER_QUERY)
      .where({ pokemonId })
      .findById(pokemonId);
    if (!pokemon) {
      return Promise.reject(`No such pokemon with id: ${pokemonId}`);
    }
    return pokemon;
  }

  static async getByName(pokemonName: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn).findOne({
      name: pokemonName,
      deletedAt: null,
    });
    if (!pokemon) {
      return Promise.reject(`No such pokemon with name: ${pokemonName}`);
    }
    return pokemon;
  }

  static async create(pokemon: IPokemonCreate, txn: Transaction): Promise<Pokemon> {
    const pokemonExists = await this.getByName(pokemon.name, txn);
    if (!pokemonExists) {
      return this.query(txn).insert(pokemon);
    }
    return Promise.reject(`Error:  ${pokemon.name} already exists.`);
  }

  static async edit(
    pokemonId: string,
    pokemon: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const exists = await this.getById(pokemonId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(pokemonId, pokemon);
    }
    return Promise.reject(`Error: couldn't update ${pokemon.name}`);
  }
  // delete

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string;
  imageUrl!: string;
}
