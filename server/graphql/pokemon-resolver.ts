
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
  IRootMutationType,
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
    const pokemon = await Pokemon.create(input, txn);
    return pokemon;
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

    const editedItem = {
      name: input.name || undefined,
      attack: input.attack || undefined,
      defense: input.defense || undefined,
      pokeType: input.pokeType || undefined,
      imageUrl: input.name || undefined

    }

    const pokemon = await Pokemon.edit(input.pokemonId, editedItem, txn);
    return pokemon;
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
    const pokemon = await Pokemon.delete(input.pokemonId, txn);
    return pokemon;
  });
}

/*
// Pokemon Get
export interface IPokemonOptions {
  input: IPokemonInput;
}

export async function pokemon(
  source: any,
  { input }: IPokemonOnRootMutationTypeArguments,
  { testTransaction }: IContext,
): Promise<IRootMutationType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    const onePokemon = await Pokemon.get(input.pokemonId, txn);
    return onePokemon;
  });
}
*/