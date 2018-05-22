import { transaction } from 'objection';
import { IRootQueryType } from 'schema';
import CBOCategory from '../models/cbo-category';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolveCBOCategories(
  root: any,
  args: {},
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['CBOCategories']> {
  return transaction(testTransaction || CBOCategory.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'CBOCategory', txn);

    return CBOCategory.getAll(txn);
  });
}
