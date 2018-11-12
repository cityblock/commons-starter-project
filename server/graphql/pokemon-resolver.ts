import { transaction, Transaction } from 'objection';

import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

export interface IContext {
  testTransaction?: Transaction;
}

export const resolvePokemon = async (
  root: {},
  args: {},
  context: Transaction,
  info: {}
): Promise<IRootQueryType['allPokemon']> => {
  const transactionCb = async (txn: Transaction): Promise<Pokemon[]> => Pokemon.getAll(txn);
  return transaction(context, transactionCb);
};
