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

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn).orderBy('pokemonNumber', 'ASC');
  }

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(input);
  }

  // static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
  //   const pokemon = await this.query(txn).findById(pokemonId);

  //   return pokemon;
  // }
  // static async create() {}
  // static async edit() {}
  // static async delete() {}
}

/* tslint:enable member-ordering */
