import { Model, Transaction } from 'objection';
import { isNil, omitBy } from 'lodash';
import uuid from 'uuid/v4';

enum PokeType {
  normal,
  grass,
  fire,
  water,
  electric,
  psychic,
  ghost,
  dark,
  fairy,
  rock,
  ground,
  steel,
  flying,
  fighting,
  bug,
  ice,
  dragon,
  poison,
}

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
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

export default class Pokemon extends Model {
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType[];
  moves!: string[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  //$beforeInsert >> objection syntax
  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'pokemon';

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn).orderBy('pokemonNumber', 'ASC');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn).findById(pokemonId);

    if (!pokemon) {
      return Promise.reject(`No such pokemon: ${pokemonId}`);
    }
    return pokemon;
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    const filteredInput = {
      ...input,
      moves: JSON.stringify(input.moves) as any,
    };
    return this.query(txn).insertAndFetch(filteredInput);
  }

  static async edit(
    pokemonId: string,
    pokemon: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const editPokemon = omitBy(
      {
        ...pokemon,
        moves: JSON.stringify(pokemon.moves) as any,
      },
      isNil,
    );
    return this.query(txn).patchAndFetchById(pokemonId, editPokemon);
  }

  static async delete(pokemonId: string, txn: Transaction) {
    return this.query(txn).patchAndFetchById(pokemonId, { deletedAt: new Date().toISOString() });
  }
}
