import { JsonSchema, Model, RelationMappings, Transaction } from 'objection';
import uuid from 'uuid/v4';
import Item from './item';


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

export interface IPokemonCreateInput {
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: string[];
  imageUrl: string;
};

export interface IPokemonEditInput {
  pokemonNumber?: number;
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: string[];
  imageUrl?: string;
};

/* tslint:disable:member-ordering */
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
  deletedAt!: string | null;
  items!: Item[]; // NOTE: not a column in the pokemon table

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  static tableName = 'pokemon';

  static jsonSchema: JsonSchema = {
    type: 'object',
    properties: {
      id: { type: 'string', minLength: 1 },
      pokemonNumber: { type: 'number' },
      name: { type: 'string', minLength: 1 },
      attack: { type: 'number' },
      defense: { type: 'number' },
      pokeType: { type: 'PokeType' },
      moves: { type: 'array' },
      imageUrl: { type: 'string', minLength: 1 },
      createdAt: { type: 'string' },
      updatedAt: { type: 'string' },
      deletedAt: { type: ['string', 'null'] },
    },
    required: ['pokemonNumber', 'name', 'attack', 'defense', 'pokeType', 'moves', 'imageUrl'],
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
    // returns all Pokemon, ordered by pokemonNumber ascending
    const pokemonResult = await this.query(txn)
      .select()
      .orderBy('pokemonNumber');
    return pokemonResult;
  };

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    // returns a single Pokemon, and associated items
    const pokemonResult = await this.query(txn)
      .eager('items')
      .findById(pokemonId) as Pokemon;
    return pokemonResult;
  };

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    // creates and returns a Pokemon
    const pokemonResult = await this.query(txn)
      .insertAndFetch(input);
    return pokemonResult;
  };

  static async edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction): Promise<Pokemon> {
    // edits and returns an existing Pokemon
    const pokemonResult = await this.query(txn)
      .patchAndFetchById(pokemonId, pokemon);
    return pokemonResult;
  };

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    // marks a Pokemon as deleted and returns it, but does not actually delete it from the database
    const deletedAt = new Date().toISOString();
    const pokemonResult = await this.query(txn)
      .patchAndFetchById(pokemonId, { deletedAt });
    return pokemonResult;
  };

};