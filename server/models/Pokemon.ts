import {
  Model,
  QueryBuilder,
  RelationMappings,
  Transaction
} from 'objection';
import uuid from 'uuid/v4';
import Item from './item';

export interface IPokemonCreateFields {
  id: string;
  name: string;
  pokemonNumber: number;
  attack: number;
  defense: number;
  pokeType: string;
  moves: string;
  imageUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface IPokemonEditInput {
  id: string;
  name?: string;
  pokemonNumber?: number;
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: string;
  imageUrl?: string;
  createdAt?: string;
  updatedAt?: string;
}

export default class Pokemon extends Model {
  static tableName = 'pokemon';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;
  static get relationMappings(): RelationMappings {
    return {
      item: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId'
        },
        modify: (builder: QueryBuilder<any>): QueryBuilder<any> => {
          return builder.where({ 'item.deletedAt': null });
        }
      }
    };
  };

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const allPokemon = await this.query(txn)
      .orderBy('pokemonNumber', 'ASC')
      .whereNull('deletedAt');
    return allPokemon;
  }

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findById(pokemonId)
      .eager('item');
    if (!pokemon) return Promise.reject(`Pokemon with id ${pokemonId} not found.`);
    return pokemon;
  }

  static async edit(pokemonId: string, fieldsToUpdate: IPokemonEditInput, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).updateAndFetchById(pokemonId, fieldsToUpdate);
  }

  // delete(pokemonId: string, txn: Transaction) - marks a Pokemon as deleted, but does not actually delete it from the database

  id!: string;
  name!: string;
  pokemonNumber!: number;
  attack!: number;
  defense!: number;
  pokeType!: string;
  moves!: string;
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;
  [k: string]: any;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}