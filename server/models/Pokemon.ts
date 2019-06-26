import { Model, RelationMappings, Transaction } from 'objection';
import { join } from 'path';
import uuid from 'uuid';
import Item from './Item';
import { PokeType } from './PokeType';


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
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string[];
  imageUrl: string;
}

export interface IPokemonEditInput {
  name?: string | null;
  attack?: number | null;
  defense?: number | null;
  pokeType?: string | null;
  moves?: Array<string | null> | null;
  imageUrl?: string | null;
}

export default class Pokemon extends Model {
  // Table
  static tableName = 'pokemon';

  // Schema
  static jsonSchema = {
    type: 'object',
    required: [],

    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: ['integer'] },
      name: { type: 'string', minLength: 1, maxLength: 255 },
      attack: { type: 'integer' },
      defense: { type: 'integer' },
      pokeType: { type: 'enu' },
      moves: { type: 'array', items: { type: 'string' } },
      imageUrl: { type: 'string', minLength: 1, maxLength: 255 },
      createdAt: { type: 'timestamp' },
      updatedAt: { type: 'timestamp' },
      deletedAt: { type: 'timestamp' },
    },
  };


  // Relations
  static relationMappings: RelationMappings = {
    item: {
      relation: Model.HasManyRelation,
      modelClass: join(__dirname, 'Item'),
      join: {
        from: 'pokemon.id',
        to: 'item.pokemonId',
      },
    },
  };

  // Custom Methods


  // returns all Pokemon, ordered by pokemonNumber ascending
  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const pokemonList = await this.query(txn).whereNull('deletedAt').orderBy('pokemonNumber');;
    return pokemonList;
  }

  // get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated items
  // useful link: http://ivanbatic.com/using-async-await-typescript-classes/
  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const individualPokemon = await this.query(txn).findById(pokemonId).eager('item').where('deletedAt', null)

    // No data, just reject
    if (!individualPokemon) return Promise.reject();

    return individualPokemon;
  }

  // creates and returns a Pokemon
  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    const createdPokemon = await this.query(txn).insertAndFetch(input);
    return createdPokemon;
  }

  // edits an existing Pokemon
  static async edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction): Promise<Pokemon> {
    const editedPokemon = await this.query(txn).patchAndFetchById(pokemonId, pokemon);
    return editedPokemon;
  }

  // marks a Pokemon as deleted, but does not actually delete it from the database
  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const deletedPokemon = await this.query(txn).patchAndFetchById(pokemonId, { deletedAt: new Date() });
    return deletedPokemon;
  }

  // Public Properties
  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string[];
  imageUrl!: string;
  createdAt!: Date;
  updatedAt!: Date;
  deletedAt!: Date;
  item!: Item[];

  // Lifecycle
  $beforeInsert() {
    this.id = uuid.v4()
    this.createdAt = new Date();
    this.updatedAt = new Date();
  }

  $beforeUpdate() {
    this.updatedAt = new Date();
  }
}
