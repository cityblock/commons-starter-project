import { Model, QueryBuilder, RelationMappings, Transaction } from 'objection';
import { IPokemonCreateInput, IPokemonEditInput, PokeType } from 'schema';
import uuid from 'uuid/v4';
import Item from './item';

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
          to: 'item.pokemonId',
        },
        modify: (builder: QueryBuilder<any>): QueryBuilder<any> => {
          return builder.where({ 'item.deletedAt': null });
        },
      },
    };
  }

  static async getAll(txn: Transaction): Promise<Pokemon[]> {
    const allPokemon = await this.query(txn)
      .orderBy('pokemonNumber', 'ASC')
      .whereNull('deletedAt');
    return allPokemon;
  }

  static async create(input: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    let postgresReadyInput = null as any;
    if (Array.isArray(input.moves)) {
      postgresReadyInput = Object.assign({}, input, { moves: JSON.stringify(input.moves) });
    }
    const newPoke = await this.query(txn).insertAndFetch(postgresReadyInput || input);
    if (!newPoke) return Promise.reject('There was a problem creating your Pokemon.');
    return newPoke;
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .findById(pokemonId)
      .whereNull('deletedAt')
      .eager('item');
    if (!pokemon) return Promise.reject(`Pokemon with id ${pokemonId} not found.`);
    return pokemon;
  }

  static async edit(
    pokemonId: string,
    fieldsToUpdate: IPokemonEditInput,
    txn: Transaction,
  ): Promise<Pokemon> {
    // const postgresReadyInput = null as any;
    // if (fieldsToUpdate.moves) {
    //   fieldsToUpdate = Object.assign({}, fieldsToUpdate, {
    //     moves: JSON.stringify(fieldsToUpdate.moves),
    //   });
    // }
    // console.log({ postgresReadyInput }, fieldsToUpdate);
    return this.query(txn).updateAndFetchById(pokemonId, fieldsToUpdate);
  }

  static async delete(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).patchAndFetchById(pokemonId, { deletedAt: new Date().toISOString() });
  }

  id!: string;
  name!: string;
  pokemonNumber!: number;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: string[];
  imageUrl!: string;
  createdAt!: string;
  updatedAt!: string;
  deletedAt!: string | null;
  [k: string]: any;
  item!: Item[] | null;

  $beforeInsert() {
    this.id = uuid();
    this.createdAt = new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  $beforeUpdate() {
    this.updatedAt = new Date().toISOString();
  }
}
