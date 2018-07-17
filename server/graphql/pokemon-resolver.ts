import { transaction, Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Pokemon from '../models/pokemon';

export async function resolvePokemon(
  // previous object, not used on root Query type
  root: {},
  // arguments provided to this field
  args: {},
  // context
  { testTransaction }: { testTransaction: Transaction },
): Promise<IRootQueryType['pokemon']> {
  return transaction(testTransaction || Pokemon.knex(), async txn => {
    return Pokemon.getAll(txn);
  });
}
