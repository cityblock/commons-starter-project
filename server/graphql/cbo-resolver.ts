import { ICBOCreateInput, ICBODeleteInput, ICBOEditInput, IRootQueryType } from 'schema';
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
): Promise<IRootQueryType['CBOs']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return CBO.getAll(txn);
}

export async function resolveCBOsForCategory(
  root: any,
  args: { categoryId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['CBOsForCategory']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return CBO.getForCategory(args.categoryId, txn);
}

export async function resolveCBO(
  root: any,
  args: { CBOId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<IRootQueryType['CBO']> {
  await accessControls.isAllowedForUser(userRole, 'view', 'CBO');
  checkUserLoggedIn(userId);

  return CBO.get(args.CBOId, txn);
}

export async function CBOCreate(
  root: any,
  { input }: ICBOCreateArgs,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'create', 'CBO');
  checkUserLoggedIn(userId);

  // TODO: Fix typings here
  return CBO.create(input as any, txn);
}

export async function CBOEdit(
  root: any,
  { input }: IEditCBOOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'CBO');
  checkUserLoggedIn(userId);

  // TODO: Fix typings here
  return CBO.edit(input as any, input.CBOId, txn);
}

export async function CBODelete(
  root: any,
  { input }: IDeleteCBOOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<CBO> {
  await accessControls.isAllowedForUser(userRole, 'delete', 'CBO');
  checkUserLoggedIn(userId);

  return CBO.delete(input.CBOId, txn);
}
