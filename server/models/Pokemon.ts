import { Model, Transaction } from 'objection';
// import uuid from 'uuid/v4';

export interface IPokemonCreateFields {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: string;
  // How do I type a JSON string? Calling it string for now.
  moves: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
}

// getAll(txn: Transaction) - returns all Pokemon, ordered by pokemonNumber ascending
// get(pokemonId: string, txn: Transaction) - returns a single Pokemon, and associated items
// create(input: IPokemonCreateInput, txn: Transaction) - creates and returns a Pokemon
// edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) - edits an existing Pokemon
// delete(pokemonId: string, txn: Transaction) - marks a Pokemon as deleted, but does not actually delete it from the database


export default class Pokemon extends Model {
  static tableName = 'pokemon';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;
  // id!: string;
  // createdAt!: string;
  // updatedAt!: string;
  // deletedAt!: string;
  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const allPokemon = await this.query(txn).orderBy('pokemonNumber', 'ASC');
    return allPokemon;
  }

  // $beforeInsert() {
  //   this.id = uuid();
  //   this.createdAt = new Date().toISOString();
  //   this.updatedAt = new Date().toISOString();
  // }

  // $beforeUpdate() {
  //   this.updatedAt = new Date().toISOString();
  // }

  // static tableName = 'puppy';

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(input);
  }

  name!: string;
  [k: string]: any;

  // static async getAll(txn: Transaction): Promise<Puppy[]> {
  //   return this.query(txn).orderBy('name', 'ASC');
  // }
}