import CBOCategory from '../models/cbo-category';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export async function resolveCBOCategories(
  root: any,
  args: {},
  { db, userRole, userId, txn }: IContext,
): Promise<CBOCategory[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBOCategory');
  checkUserLoggedIn(userId);

  return await CBOCategory.getAll(txn);
}
