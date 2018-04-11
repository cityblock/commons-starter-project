import { kebabCase } from 'lodash';
import {
  IComputedFieldCreateInput,
  IComputedFieldDeleteInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ComputedField, { ComputedFieldOrderOptions } from '../models/computed-field';
import checkUserPermissions from './shared/permissions-check';
import { formatOrderOptions, IContext } from './shared/utils';

export interface IComputedFieldCreateArgs {
  input: IComputedFieldCreateInput;
}

export interface IResolveComputedFieldOptions {
  computedFieldId: string;
}

export interface IResolveComputedFieldsOptions {
  orderBy?: ComputedFieldOrderOptions;
  order: 'asc' | 'desc';
}

export interface IDeleteComputedFieldOptions {
  input: IComputedFieldDeleteInput;
}

export async function computedFieldCreate(
  root: any,
  { input }: IComputedFieldCreateArgs,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['computedFieldCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'computedField', txn);

  const slug = kebabCase(input.label);

  return ComputedField.create({ slug, ...input }, txn);
}

export async function resolveComputedField(
  root: any,
  args: IResolveComputedFieldOptions,
  { db, userId, permissions, txn }: IContext,
): Promise<IRootQueryType['computedField']> {
  await checkUserPermissions(userId, permissions, 'view', 'computedField', txn);

  return ComputedField.get(args.computedFieldId, txn);
}

export async function resolveComputedFields(
  root: any,
  args: IResolveComputedFieldsOptions,
  { db, userId, permissions, txn }: IContext,
): Promise<IRootQueryType['computedFields']> {
  await checkUserPermissions(userId, permissions, 'view', 'computedField', txn);

  const { order, orderBy } = formatOrderOptions<ComputedFieldOrderOptions>(args.orderBy, {
    orderBy: 'label',
    order: 'asc',
  });

  return ComputedField.getAll({ orderBy, order }, txn);
}

export async function computedFieldDelete(
  root: any,
  args: IDeleteComputedFieldOptions,
  { db, userId, permissions, txn }: IContext,
): Promise<IRootMutationType['computedFieldDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'computedField', txn);

  return ComputedField.delete(args.input.computedFieldId, txn);
}
