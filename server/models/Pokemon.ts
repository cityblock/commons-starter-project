import { Model, RelationMappings, Transaction } from 'objection';
import { join } from 'path';
import { uniqueId } from 'schema';
import { pokeType } from './pokeType';


/*
- id (primary key, unique, [uuid], not null) ­ note we use uuid rather than integer ids
- pokemonNumber (integer, not null, unique)
- name (string, not null, unique)
- attack (integer, not null)
- defense (integer, not null)
- pokeType ([enum]), not null, one of: normal, grass, fire, water, electric, psychic, ghost, dark, fairy, rock, ground, steel, flying, fighting, bug, ice, dragon, poison)
- moves ([json]), not null, default [])
- imageUrl (string, not null)
- createdAt (timestamp, default to the current time)
- updatedAt (timestamp, default to the current time)
- deletedAt (timestamp, nullable) ­ note we mark things as deleted, but rarely ever actually delete them in our database (“soft deletion”)
*/


// Interfaces
export interface IPokemonCreateInput {
  id: uniqueId;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: pokeType;
  moves: JSON;
  imageUrl: string;
}

export interface IPokemonEditInput {
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: pokeType;
  moves?: JSON;
  imageUrl?: string;
}

export default class Pokemon extends Model {
  // Table
  static tableName = 'pokemon';

  // Schema
  static jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      id: { type: 'uuid' },
      pokemonNumber: { type: ['integer', 'null'] },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      attack: { type: 'integer' },
      defense: { type: 'integer' },
      pokeType: { type: 'enu' },
      moves: { type: 'JSON' },
      imageUrl: { type: 'string', minLength: 1, maxLength: 255 },
      createdAt: { type: 'timestamp' },
      updatedAt: { type: 'timestamp' },
      deletedAt: { type: 'timestamp' },
    },
  };


  // Relations
  static relationMappings: RelationMappings = {
    items: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'Item'),
      join: {
        from: 'pokemon.id',
        to: 'items.pokemon_id',
      },
    },
  };


  // Custom Methods


  // returns all Pokemon, ordered by pokemonNumber ascending
  static async getAll(txn: Transaction) {
    return this.query(txn).whereNull('deletedAt'); // Exclude deleted pokemons
  }

  // get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated items
  // useful link: http://ivanbatic.com/using-async-await-typescript-classes/
  static async get(pokemonId: string, txn: Transaction) {
    return this.query(txn).findById(pokemonId);
  }

  // creates and returns a Pokemon
  static async create(input: IPokemonCreateInput, txn: Transaction) {
    await this.query(txn).insert(input);
  }

  // edits an existing Pokemon
  static async edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) {
    return this.query(txn)
      .findById(pokemonId)
      .patch(pokemon)
  }

  // marks a Pokemon as deleted, but does not actually delete it from the database
  static async delete(pokemonId: string, txn: Transaction) {
    return this.query(txn)
      .findById(pokemonId)
      .patch({ deletedAt: new Date() })
  }

  // Public Properties
  readonly id!: uniqueId;
  pokemonNumber?: number;
  name!: string;
  attack?: number;
  defense!: number;
  pokeType!: pokeType;
  moves!: JSON;
  imageUrl!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt?: Date;

  // Lifecycle
  $beforeInsert() {
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
