import { Model, RelationMappings, Transaction } from 'objection';
import { v4 as uuid } from 'uuid';
import Item from './item';

export enum PokemonType {
  normal = 'normal',
  grass = 'grass',
  fire = 'fire',
  water = 'water',
  electric = 'electric',
  psychic = 'psychic',
  ghost = 'ghost',
  dark = 'dark',
  fairy = 'fairy',
  rock = 'rock',
  ground = 'ground',
  steel = 'steel',
  flying = 'flying',
  fighting = 'fighting',
  bug = 'bug',
  ice = 'ice',
  dragon = 'dragon',
  poison = 'poison',
}

export interface IPokemonCreateInput {
  pokemonNumber?: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokemonType;
  moves: string[];
  imageUrl: string;
}

export default class Pokemon extends Model {
  static tableName = 'pokemon';

  // tslint:disable-next-line: member-ordering
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

  // tslint:disable-next-line: member-ordering
  static async create(pokemon: IPokemonCreateInput, txn: Transaction) {
    return this.query(txn).insertAndFetch(pokemon);
  }

  static async getAll(txn: Transaction) {
    return this.query(txn).orderBy('pokemonNumber');
  }

  static async get(pokeminId: string, txn: Transaction) {
    const pokemon = await this.query(txn)
      .eager('items')
      .findById(pokeminId);
    if (!pokemon) return Promise.reject(`could not find pokemn with id: ${pokeminId}`);
    else return pokemon;
  }
  static async edit(pokemonId: string, pokemon: IPokemonCreateInput, txn: Transaction) {
    const updatedPokemon = await this.query(txn).patchAndFetchById(pokemonId, pokemon);
    if (!updatedPokemon) return Promise.reject(`could not update pokemon with id: ${pokemonId}`);
    else return updatedPokemon;
  }
  static async delete(pokemonId: string, txn: Transaction) {
    const pokemon = await this.query(txn).patchAndFetchById(pokemonId, {
      deletedAt: new Date().toISOString(),
    });
    if (!pokemon) return Promise.reject(`could not mark as deleted pokemon with id: ${pokemonId}`);
    else return pokemon;
  }

  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokemonType;
  moves!: string[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }

  $beforeDelete() {
    this.deletedAt = new Date().toISOString();
  }

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
}
