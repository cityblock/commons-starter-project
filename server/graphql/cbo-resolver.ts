import { ICBOCreateInput, ICBODeleteInput, ICBOEditInput, IRootQueryType } from 'schema';
import CBO from '../models/cbo';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { db, permissions, userId, txn }: IContext,
): Promise<IRootQueryType['CBOs']> {
  await checkUserPermissions(userId, permissions, 'view', 'CBO', txn);

  return CBO.getAll(txn);
}

export async function resolveCBOsForCategory(
  root: any,
  args: { categoryId: string },
  { db, permissions, userId, txn }: IContext,
): Promise<IRootQueryType['CBOsForCategory']> {
  await checkUserPermissions(userId, permissions, 'view', 'CBO', txn);

  return CBO.getForCategory(args.categoryId, txn);
}

export async function resolveCBO(
  root: any,
  args: { CBOId: string },
  { db, permissions, userId, txn }: IContext,
): Promise<IRootQueryType['CBO']> {
  await checkUserPermissions(userId, permissions, 'view', 'CBO', txn);

  return CBO.get(args.CBOId, txn);
}

export async function CBOCreate(
  root: any,
  { input }: ICBOCreateArgs,
  { db, permissions, userId, txn }: IContext,
): Promise<CBO> {
  await checkUserPermissions(userId, permissions, 'create', 'CBO', txn);

  return CBO.create({ ...input, fax: input.fax || undefined }, txn);
}

export async function CBOEdit(
  root: any,
  { input }: IEditCBOOptions,
  { db, permissions, userId, txn }: IContext,
): Promise<CBO> {
  await checkUserPermissions(userId, permissions, 'edit', 'CBO', txn);

  // TODO: Fix typings here
  return CBO.edit(input as any, input.CBOId, txn);
}

export async function CBODelete(
  root: any,
  { input }: IDeleteCBOOptions,
  { db, permissions, userId, txn }: IContext,
): Promise<CBO> {
  await checkUserPermissions(userId, permissions, 'delete', 'CBO', txn);

  return CBO.delete(input.CBOId, txn);
}
