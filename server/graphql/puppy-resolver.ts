import { transaction, Transaction } from 'objection';
import { IRootQueryType } from 'schema';
import Puppy from '../models/puppy';

export async function resolvePuppies(
  root: {},
  args: {},
  {
    testTransaction,
  }: {
    testTransaction: Transaction;
  },
): Promise<IRootQueryType['puppies']> {
  return transaction(testTransaction || Puppy.knex(), async txn => {
    return Puppy.getAll(txn);
  });
}
