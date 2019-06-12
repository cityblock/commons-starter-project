import { isNil, omitBy } from 'lodash';
import {
  IPokemonCreateOnRootMutationTypeArguments,
  IPokemonEditInput,
  IPokemonEditOnRootMutationTypeArguments,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export interface IPokemonQuery {
  pokemonId: string;
}

export interface IPokemonDelete {
  pokemonId: string;
}

export async function resolvePokemon(
  root: any,
  { pokemonId }: IPokemonQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.get(pokemonId, txn);
  });
}

export async function resolvePokemons(
  root: any,
  {  }: any,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['pokemons']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.getAll(txn);
  });
}

export async function pokemonCreate(
  root: any,
  { input }: IPokemonCreateOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['pokemonCreate']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.create(input, txn);
  });
}

export async function pokemonEdit(
  root: any,
  { input }: IPokemonEditOnRootMutationTypeArguments,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['pokemonEdit']> {
  const filtered = omitBy<IPokemonEditInput>(input, isNil) as any;
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.edit(input.pokemonId, filtered, txn);
  });
}

export async function pokemonDelete(
  root: any,
  { pokemonId }: IPokemonDelete,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootMutationType['pokemonDelete']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.delete(pokemonId, txn);
  });
}
