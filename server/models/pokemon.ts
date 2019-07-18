import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base-model';
import Item from './item';

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
  item: Item[];
}

export interface IPokemonCreate {
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string;
  imageUrl: string;
}

export interface IPokemonEditInput {
  name?: string;
  pokemonNumber?: number;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: string;
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

export default class Pokemon extends BaseModel {
  static modelPaths = [__dirname];
  static tableName = 'pokemon';

  static get relationMappings(): RelationMappings {
    return {
      item: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId',
        },
        modify: builder => builder.where({ 'item.deletedAt': null }),
      },
    };
  }

  static async get(txn: Transaction): Promise<Pokemon[]> {
    const pokemon = await this.query(txn)
      .eager('item')
      .orderBy('pokemonNumber');
    if (!pokemon) {
      return Promise.reject('No pokemon in db');
    }
    return pokemon;
  }

  static async getById(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await Pokemon.query(txn)
      .eager('item')
      .findOne({
        id: pokemonId,
        deletedAt: null,
      });
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
      return Promise.reject(`Pokemon doesn't exist in DB`);
    }
    return pokemon;
  }

  static async pokemonExists(pokemonName: string, txn: Transaction): Promise<boolean> {
    const pokemon = await this.query(txn).findOne({
      name: pokemonName,
      deletedAt: null,
    });
    if (!pokemon) {
      return false;
    }
    return true;
  }

  static async create(pokemon: IPokemonCreate, txn: Transaction): Promise<Pokemon> {
    const pokemonExists = await this.pokemonExists(pokemon.name, txn);
    if (!pokemonExists) {
      return this.query(txn).insertAndFetch(pokemon);
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

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const exists = await this.getById(pokemonId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(pokemonId, {
        deletedAt: new Date(Date.now()).toISOString(),
      });
    }
    return Promise.reject(`Error: couldn't delete Pokemon (ID): ${pokemonId}`);
  }

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string;
  imageUrl!: string;
  item!: Item[];
}
