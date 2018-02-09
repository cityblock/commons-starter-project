import { IRootQueryType } from 'schema';
import CBOCategory from '../models/cbo-category';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export async function resolveCBOCategories(
  root: any,
  args: {},
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['CBOCategories']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBOCategory');
  checkUserLoggedIn(userId);

  return CBOCategory.getAll(txn);
}
