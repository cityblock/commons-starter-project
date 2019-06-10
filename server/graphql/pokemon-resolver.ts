import { transaction, Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';
import { IContext } from './shared/utils';

// two types of resolving: one is telling the query which data model method to run
// other one is
// resolvers take 3 args, roots, query params and context

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
