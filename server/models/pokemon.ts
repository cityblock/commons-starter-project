import { QueryBuilder, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';

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
    const pokemon = await this.query();
    if (!pokemon) {
      return Promise.reject('No pokemon in db');
    }
    return pokemon;
  }

  static async getOne(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn).findOne({
      id: pokemonId,
      deletedAt: null,
    });
    if (!pokemon) {
      return Promise.reject(`No such partner: ${pokemonId}`);
    }
    return pokemon;
  }

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string;
  imageUrl!: string;
}
