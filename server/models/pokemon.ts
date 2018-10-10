import { Model, Transaction } from 'objection';
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
  poison
}

//TODO: how to get JSON as typed array?????
//look at lines: 28, 37 & 51

interface movesJSON {
  moves: moves[];
}

export interface IPokemonCreateFields {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: movesJSON;
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
  moves!: movesJSON[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string;

  //objection.js syntax??
  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  //objection.js syntax??
  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'pokemon';

  //understand this function better...language around `Promise<Pokemon[]>`
  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    //Promise<> ...returns Pokemon array ... is this typescript syntax?
    return this.query(txn).orderBy('pokemonNumber ', 'ASC');
  }

  //so what is this pokemon returning...is it an object??? How can I verify it's an object that is getting returned?
  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findById(pokemonId);

    if (!pokemon) {
      return Promise.reject(`No such pokemon: ${pokemonId}`);
    }
    return pokemon;
  }

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(input);
    //need to return instance of Pokemon
  }




}