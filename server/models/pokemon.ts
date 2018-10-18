import { Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Item from './item';
import { PokeType } from 'schema';

const EAGER_QUERY = 'items';

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
  pokemonNumber?: number;
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: string[];
  imageUrl?: string;
}

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
  items!: Item[];
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

  static jsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string' },
      pokemonNumber: { type: 'number' },
      name: { type: 'string' },
      attack: { type: 'number' },
      defense: { type: 'nunmber' },
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
      moves: { type: 'string' },
      imageUrl: { type: 'string' },
      updatedAt: { type: 'string' },
      createdAt: { type: 'string' },
      deletedAt: { type: 'string' },
    },
    required: ['name', 'pokemonNumber', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
  };

  static get relationMappings(): RelationMappings {
    return {
      items: {
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
    return this.query(txn)
      .where({ deletedAt: null })
      .orderBy('pokemonNumber', 'ASC');
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .eager(EAGER_QUERY)
      .modifyEager('items', builder => {
        builder.where({ deletedAt: null });
      })
      .findOne({ id: pokemonId, deletedAt: null });

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
    const editPokemon = {
      ...pokemon,
      moves: JSON.stringify(pokemon.moves) as any,
    };
    const updatedPokemon = await this.query(txn).patchAndFetchById(pokemonId, editPokemon);
    if (!updatedPokemon) {
      return Promise.reject(`No such pokemon: ${pokemonId}`);
    }
    return updatedPokemon;
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .where({ deletedAt: null })
      .patchAndFetchById(pokemonId, { deletedAt: new Date().toISOString() });
    if (!pokemon) {
      return Promise.reject(`No such pokemon: ${pokemonId}`);
    }
    return pokemon;
  }
}
