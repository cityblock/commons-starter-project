import { transaction, Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

export interface IQuery {
  pokemonId: string;
}

export async function resolvePokemon(
  root: any,
  { pokemonId }: IQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.get(pokemonId, txn);
  });
}

export async function resolvePokemons(
  root: any,
  {  }: IQuery,
  { testTransaction, getOrCreateTransaction }: IContext,
): Promise<IRootQueryType['pokemons']> {
  return getOrCreateTransaction(testTransaction, async txn => {
    return Pokemon.getAll(txn);
  });
}
