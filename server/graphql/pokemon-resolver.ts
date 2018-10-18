import { transaction, Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

interface IContext {
  testTransaction: Transaction;
}

export async function resolvePokemon(
  root: {},
  args: {},
  { testTransaction }: IContext,
): Promise<IRootQueryType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}
