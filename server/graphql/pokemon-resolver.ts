import { isNil, omitBy } from 'lodash';
import { transaction } from 'objection';
import { IContext } from './shared/utils';

// Interfaces
import {
  IPokemonCreateInput,
  IPokemonCreateOnRootMutationTypeArguments,
  IPokemonDeleteInput,
  IPokemonDeleteOnRootMutationTypeArguments,
  IPokemonEditInput,
  IPokemonEditOnRootMutationTypeArguments,
  IPokemonInput,
  IPokemonOnRootQueryTypeArguments,
  IRootMutationType,
  IRootQueryType,
} from 'schema';

// Models
import Pokemon from '../models/Pokemon';

// Pokemon Create
export interface IPokemonCreateOptions {
  input: IPokemonCreateInput;
}

export async function pokemonCreate(
  source: any,
  { input }: IPokemonCreateOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonCreate']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.create(input, txn);
  });
}

// Pokemon Edit
export interface IPokemonEditOptions {
  input: IPokemonEditInput;
}

export async function pokemonEdit(
  source: any,
  { input }: IPokemonEditOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonEdit']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    if (!input) return Promise.reject('No input given for Edit');

    const filtered = omitBy<IPokemonEditInput>(input, isNil) as any;

    return Pokemon.edit(input.id, filtered, txn);
  });
}

// Pokemon Delete
export interface IPokemonDeleteOptions {
  input: IPokemonDeleteInput;
}

export async function pokemonDelete(
  source: any,
  { input }: IPokemonDeleteOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemonDelete']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    if (!input) return Promise.reject('No input given for Delete');
    return Pokemon.delete(input.pokemonId, txn);
  });
}

// Pokemon Get
export interface IPokemonOptions {
  input: IPokemonInput;
}

export async function pokemon(
  source: any,
  { pokemonId }: IPokemonOnRootQueryTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.get(pokemonId, txn);
  });
}

// Pokemons Get All
export async function pokemons(
  source: any,
  { pokemonId }: IPokemonOnRootQueryTypeArguments,
  { testTransaction }: IContext,
): Promise<Array<IRootQueryType['pokemon']>> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}
