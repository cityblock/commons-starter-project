
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
    const createdPokemon = await Pokemon.create(input, txn);
    return createdPokemon;
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

    const editedPokemon = await Pokemon.edit(input.id, filtered, txn);
    return editedPokemon;
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
    if (!input) return Promise.reject('No input given for Delete')
    const deletedPokemon = await Pokemon.delete(input.pokemonId, txn);
    return deletedPokemon;
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
    const onePokemon = await Pokemon.get(pokemonId, txn);
    return onePokemon;
  });
}


// Pokemon Get All
export async function pokemonAll(
  source: any,
  { pokemonId }: IPokemonOnRootQueryTypeArguments,
  { testTransaction }: IContext
): Promise<Array<IRootQueryType['pokemon']>> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const allPokemon = await Pokemon.getAll(txn);
    return allPokemon;
  });
};
