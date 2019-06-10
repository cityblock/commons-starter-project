import { Model, RelationMappings, Transaction } from 'objection';
import { PokeType } from '../constants/poke-types';
import BaseModel from './base-model';
import Item from './item';

// is there any reason here why we would not want the create interface to inherit from the edit interface?
interface IPokemonCreateInput {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: JSON;
  imageUrl: string;
}

interface IPokemonEditInput {
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: JSON;
  imageUrl?: string;
}

/*tslint:disable:member-ordering*/
export default class Pokemon extends BaseModel {
  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: JSON;
  imageUrl!: string;
  item!: Item[];

  static tableName = 'pokemon';

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'string' },
      moves: { type: 'object' },
      imageUrl: { type: 'string' },
      item: { type: 'array' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: [
      'id',
      'pokemonNumber',
      'name',
      'attack',
      'defense',
      'pokeType',
      'moves',
      'imageUrl',
      'createdAt',
      'item',
    ],
  };

  static get relationMappings(): RelationMappings {
    return {
      item: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId',
        },
      },
    };
  }

  static async create(pokemon: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insert(pokemon);
  }

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const pokemon = await this.query(txn)
      .where('deletedAt', null)
      .orderBy('pokemonNumber');
    return pokemon;
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findById(pokemonId)
      .eager('item')
      .modifyEager('item', builder => builder.where('item.deletedAt', null))
      .where('pokemon.deletedAt', null);
    // weird that we need to cast here

    if (!pokemon) {
      return Promise.reject(`No such pokemon in your pocket with ${pokemonId}`);
    }

    return pokemon;
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const deleted = await this.query(txn).patchAndFetchById(pokemonId, {
      deletedAt: new Date().toISOString(),
    });
    return deleted;
  }

  static async edit(
    pokemonId: string,
    pokemonEditInput: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const editedPokemon = await this.query(txn).patchAndFetchById(pokemonId, pokemonEditInput);

    return editedPokemon;
  }
}
/*tslint:disable:member-ordering*/

/*
DONE ● getAll(txn: Transaction) ­ returns all Pokemon, ordered by pokemonNumber ascending
--> test: check that it returned something, test that it returns the table length?
DONE● get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated
items
--> test: it returns a single pokemon
--> test that it returned the length of items associated with that poke
DONE● create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
--> test that it generated one pokemon
--> test that it returned just one pokemon
● edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an
existing Pokemon
--> test that it edited just one pokemon
● delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not
actually delete it from the database
--> test that it marked the poke as deleted
*/
