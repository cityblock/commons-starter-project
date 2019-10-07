import { Item } from './item';
const { Model } = require('objection');
import { Transaction } from 'objection';

interface IPokemonCreateInput {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: string;
  moves: object;
  imageUrl: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

interface IPokemonEditInput {
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: object;
  imageUrl?: string;
  updatedAt?: Date;
  deletedAt?: Date | null;
}

export class Pokemon extends Model {
  static get tableName() {
    return 'pokemon';
  }

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'string' },
      moves: { type: 'array' },
      imageUrl: { type: 'Date' },
      createdAt: { type: 'Date' },
      updatedAt: { type: 'Date' },
      deletedAt: { type: 'Date' },
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
      'updatedAt',
    ],
  };

  static get relationshipMappings() {
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

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn).orderBy('pokemonNumber');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<[Pokemon, Item[]]> {
    const pokemonAndItems = this.query(txn)
      .eager('pokemon.item')
      .joinRelation('item')
      .where({ id: pokemonId });

    if (!pokemonAndItems) {
      return Promise.reject(`Error fetching Pokemon ${pokemonId} or associated items.`);
    }
    return pokemonAndItems;
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    const createdPokemon = this.query(txn).insertAndFetch(input);
    if (!createdPokemon) {
      return Promise.reject(`Could not create Pokemon, please try again.`);
    }
    return createdPokemon;
  }

  static async edit(
    pokemonId: string,
    pokemon: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const editedPokemon = this.query(txn).patchAndFetchById(pokemonId, pokemon);
    if (!editedPokemon) {
      return Promise.reject(`No such item: ${pokemonId}`);
    }
    return editedPokemon;
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    await this.query(txn)
      .where({ id: pokemonId })
      .patch({ deletedAt: new Date(Date.now()) });

    const deletedPokemon = this.query(txn).findById(pokemonId);
    if (!deletedPokemon) {
      return Promise.reject(`No such item: ${pokemonId}`);
    }
    return deletedPokemon;
  }

  static async getNonDeletedPokemon(txn: Transaction): Promise<Pokemon> {
    return this.query(txn)
      .where({ deletedAt: null })
      .limit(1);
  }
}
