import { Model, RelationMappings, Transaction } from 'objection';
import { PokeType } from '../constants/poke-types';
import BaseModel from './base-model';
import Item from './item';

// is there any reason here why we would not want the create interface to inherit from the edit interface?
interface IPokemonCreateInput {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: JSON;
  imageUrl: string;
}

interface IPokemonEditInput {
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: string;
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
  pokeType!: string;
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
      pokeType: {
        type: 'string',
        enum: Object.keys(PokeType).filter(k => typeof PokeType[k as any] === 'number'),
      },
      moves: { type: 'array' },
      imageUrl: { type: 'string' },
      item: { type: 'array' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['pokemonNumber', 'name', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
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
    return this.query(txn).insertAndFetch(pokemon);
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
