import { Model, RelationMappings, Transaction } from 'objection';
import BaseModel from './base';
import Item from './item';


export interface IPokemonInput {
  name: string;
  attack?: number;
  defense?: number;
  pokeType?: string;
  moves?: JSON;
  imageUrl?: string;
}

export default class Pokemon extends BaseModel {
  static tableName = 'pokemon';
  static modelPaths = [__dirname];
  static pickJsonSchemaProperties = true;

  static get relationMappings(): RelationMappings {
    return {
      items: {
        relation: Model.HasManyRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId'
        }
      }
    };
  }

  static async getAll(txn?: Transaction): Promise<Pokemon[]> {
    return this.query(txn).where({ deletedAt: null }).orderBy('pokemonNumber', 'ASC')
  }

  static async get(pid: string, txn?: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .eager('items')
      .findOne({ id: pid, deletedAt: null });

    if (!pokemon) return Promise.reject('No pokemon found with ID ' + pid);

    return pokemon;
  }

  static async create(p_args: IPokemonInput, txn?: Transaction): Promise<Pokemon> {
    return this.query(txn).insert(p_args as Partial<Pokemon>).returning('*');
  }

  static async edit(pid: string, p_args: IPokemonInput, txn?: Transaction): Promise<Pokemon> {
    const updatedPoke = await this.query(txn).patchAndFetchById(pid, p_args as Partial<Pokemon>).eager('items');
    if (!updatedPoke) return Promise.reject('No pokemon found with ID ' + pid);
    return updatedPoke;
  }

  static async delete(pid: string, txn?: Transaction): Promise<Pokemon> {
    const deletedPoke = await this.query(txn).patchAndFetchById(pid, {
      deletedAt: new Date().toISOString()
    } as Partial<Pokemon>);

    if (!deletedPoke) return Promise.reject('No pokemon found with ID ' + pid);
    return deletedPoke;
  }

  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: string;
  moves!: JSON;
  imageUrl!: string;
  items!: Item[];

}