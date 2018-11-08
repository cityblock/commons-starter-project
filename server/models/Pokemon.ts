import { Model, Transaction } from 'objection';
import Item from './item';
import uuid from 'uuid/v4';

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

interface PokemonWithItems {
  pokemon: IPokemonCreateFields;
  items?: any[];
}

// getAll(txn: Transaction) - returns all Pokemon, ordered by pokemonNumber ascending
// create(input: IPokemonCreateInput, txn: Transaction) - creates and returns a Pokemon
// edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) - edits an existing Pokemon
// delete(pokemonId: string, txn: Transaction) - marks a Pokemon as deleted, but does not actually delete it from the database


export default class Pokemon extends Model {
  static tableName = 'pokemon';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;
  static relationMappings = {
    item: {
      relation: Model.HasManyRelation,
      modelClass: Item,
      join: {
        from: 'pokemon.id',
        to: 'item.pokemonId'
      }
    }
  };

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
  deletedAt: string | undefined;
  [k: string]: any;

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const allPokemon = await this.query(txn).orderBy('pokemonNumber', 'ASC');
    return allPokemon;
  }

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static async create(input: IPokemonCreateFields, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insertAndFetch(input);
  }

  static async get(pokemonId: string, txn: Transaction): Promise<PokemonWithItems> {
    const pokemon = await this.query(txn).findById(pokemonId);
    const items = await this.query(txn)
      .select('*').from('item')
      .where('item.pokemonId', pokemonId);

    if (!pokemon) return Promise.reject(`Pokemon with id ${pokemonId} not found.`);
    return {
      pokemon,
      items
    };
  }
  // static async get(pokemonId: string, txn: Transaction): Promise<PokemonWithItems> {
  //   const pokemon: Pokemon | undefined = await this.query(txn).findById(pokemonId);
  //   const items: Item[] = await this.query(txn).where('pokemonId', '=', pokemonId);
  //   return {
  //     pokemon,
  //     items
  //   };
  // }


  // static async getAll(txn: Transaction): Promise<Puppy[]> {
  //   return this.query(txn).orderBy('name', 'ASC');
  // }
}