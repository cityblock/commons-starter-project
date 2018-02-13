import { IRootQueryType } from 'schema';
import CBOCategory from '../models/cbo-category';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export async function resolveCBOCategories(
  root: any,
  args: {},
  { db, permissions, userId, txn }: IContext,
): Promise<IRootQueryType['CBOCategories']> {
  await checkUserPermissions(userId, permissions, 'view', 'CBOCategory', txn);

  return CBOCategory.getAll(txn);
}
