import { ICBOCreateInput, ICBODeleteInput, ICBOEditInput } from 'schema';
import CBO from '../models/cbo';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface ICBOCreateArgs {
  input: ICBOCreateInput;
}

export interface IEditCBOOptions {
  input: ICBOEditInput;
}

export interface IDeleteCBOOptions {
  input: ICBODeleteInput;
}

export async function resolveCBOs(
  root: any,
  args: {},
  { db, userRole, userId, txn }: IContext,
): Promise<CBO[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return await CBO.getAll(txn);
}

export async function resolveCBOsForCategory(
  root: any,
  args: { categoryId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<CBO[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return await CBO.getForCategory(args.categoryId, txn);
}

export async function resolveCBO(
  root: any,
  args: { CBOId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return await CBO.get(args.CBOId, txn);
}

export async function CBOCreate(
  root: any,
  { input }: ICBOCreateArgs,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'create', 'CBO');
  checkUserLoggedIn(userId);

  // TODO: Fix typings here
  return await CBO.create(input as any, txn);
}

export async function CBOEdit(
  root: any,
  { input }: IEditCBOOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'CBO');
  checkUserLoggedIn(userId);

  // TODO: Fix typings here
  return await CBO.edit(input as any, input.CBOId, txn);
}

export async function CBODelete(
  root: any,
  { input }: IDeleteCBOOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'delete', 'CBO');
  checkUserLoggedIn(userId);

  return await CBO.delete(input.CBOId, txn);
}
