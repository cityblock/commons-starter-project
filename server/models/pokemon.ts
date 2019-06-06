import { Model, RelationMappings, Transaction } from 'objection';
import { PokeType } from '../constants/poke-types';
import BaseModel from './base-model';
// import Item from './item';

interface IPokemonCreateInput {
  id: string;
  pokemonNumber: number;
  name: string;
  attack: number;
  defense: number;
  pokeType: PokeType;
  moves: JSON;
  imageUrl: string;
}

interface IPokemonEditInput {
  name?: string;
  attack?: number;
  defense?: number;
  pokeType?: PokeType;
  moves?: JSON;
  imageUrl?: string;
}

/*tslint:disable:member-ordering*/
class Pokemon extends BaseModel {
  id!: string;
  pokemonNumber!: number;
  name!: string;
  attack!: number;
  defense!: number;
  pokeType!: PokeType;
  moves!: JSON;
  imageUrl!: string;

  static tableName = 'pokemon';

  static get relationMappings(): RelationMappings {
    return {
      item: {
        relation: Model.BelongsToOneRelation,
        modelClass: Item,
        join: {
          from: 'pokemon.id',
          to: 'item.pokemonId',
        },
      },
    };
  }

  static async create(pokemon: IPokemonCreateInput, txn: Transaction): Promise<Pokemon> {
    return this.query(txn).insert(pokemon);
  }

  static async getAll(txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query(txn)
      .where('deletedAt', null)
      .orderBy('pokemonNumber');
    if (!pokemon) {
      return Promise.reject(`You have no pokemon in your pocket`);
    }
    return pokemon;
  }

  static async get(pokemonId: string, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query()
      .findById(pokemonId)
      .eager('item')
      .where('item.deletedAt', null)
      .andWhere('pokemon.deletedAt', null)
      .andWhere('item.pokemonId', pokemonId);

    return pokemon as Pokemon;
  }

  static async edit(pokemonId: string, IPokemonEditInput, txn: Transaction): Promise<Pokemon> {
    const pokemon = await this.query().findById(pokemonId);

    return pokemon;
  }
}
/*tslint:disable:member-ordering*/

module.exports = Pokemon;

/*
DONE ● getAll(txn: Transaction) ­ returns all Pokemon, ordered by pokemonNumber ascending
--> test: check that it returned something, test that it returns the table length?
DONE● get(pokemonId: string, txn: Transaction) ­ returns a single Pokemon, and associated
items
--> test: it returns a single pokemon
--> test that it returned the length of items associated with that poke
DONE● create(input: IPokemonCreateInput, txn: Transaction) ­ creates and returns a Pokemon
--> test that it generated one pokemon
--> test that it returned just one pokemon
● edit(pokemonId: string, pokemon: IPokemonEditInput, txn: Transaction) ­ edits an
existing Pokemon
--> test that it edited just one pokemon
● delete(pokemonId: string, txn: Transaction) ­ marks a Pokemon as deleted, but does not
actually delete it from the database
--> test that it marked the poke as deleted
*/
