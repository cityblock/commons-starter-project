import { Model, RelationMappings, Transaction } from 'objection';
import { PokeType } from 'schema';
import BaseModel from './base-model';
import Item from './item';

interface IPokemonCreate {
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
}

interface IPokemonEditInput {
  name?: string;
  pokemonNumber?: number;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: string[];
  imageUrl?: string;
}

export default class Pokemon extends BaseModel {
  static modelPaths = [__dirname];
  static tableName = 'pokemon';
  static pickJsonSchemaProperties = true;

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', format: 'uuid' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: {
        type: 'string',
        enum: [
          'normal',
          'grass',
          'fire',
          'water',
          'electric',
          'psychic',
          'ghost',
          'dark',
          'fairy',
          'rock',
          'ground',
          'steel',
          'flying',
          'fighting',
          'bug',
          'ice',
          'dragon',
          'poison',
        ],
      },
      moves: { type: 'array', items: { type: 'string' } },
      imageUrl: { type: 'string' },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
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
        modify: builder => builder.where({ 'item.deletedAt': null }),
      },
    };
  }

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    return this.query(txn)
      .where({ deletedAt: null })
      .eager('item')
      .orderBy('pokemonNumber');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
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
      return Promise.reject(`No such pokemon with name: ${pokemonName}`);
    }
    return pokemon;
  }

  static async create(pokemon: IPokemonCreate, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(pokemon);
  }

  static async edit(
    pokemonId: string,
    pokemon: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    const exists = await this.get(pokemonId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(pokemonId, pokemon);
    }
    return Promise.reject(`Error: couldn't update ${pokemon.name}`);
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const exists = await this.get(pokemonId, txn);
    if (exists) {
      return this.query(txn).patchAndFetchById(pokemonId, {
        deletedAt: new Date().toISOString(),
      });
    }
    return Promise.reject(`Error: couldn't delete Pokemon (ID): ${pokemonId}`);
  }

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string[];
  imageUrl!: string;
  item!: Item[];
}
