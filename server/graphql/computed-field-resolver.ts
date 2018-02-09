import { kebabCase } from 'lodash';
import {
  IComputedFieldCreateInput,
  IComputedFieldDeleteInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import ComputedField, { ComputedFieldOrderOptions } from '../models/computed-field';
import accessControls from './shared/access-controls';
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
  context: IContext,
): Promise<IRootMutationType['computedFieldCreate']> {
  const { userRole, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'computedField');

  const slug = kebabCase(input.label);

  return ComputedField.create({ slug, ...input }, txn);
}

export async function resolveComputedField(
  root: any,
  args: IResolveComputedFieldOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['computedField']> {
  await accessControls.isAllowed(userRole, 'view', 'computedField');

  return ComputedField.get(args.computedFieldId, txn);
}

export async function resolveComputedFields(
  root: any,
  args: IResolveComputedFieldsOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['computedFields']> {
  await accessControls.isAllowed(userRole, 'view', 'computedField');

  const { order, orderBy } = formatOrderOptions<ComputedFieldOrderOptions>(args.orderBy, {
    orderBy: 'createdAt',
    order: 'desc',
  });

  return ComputedField.getAll({ orderBy, order }, txn);
}

export async function computedFieldDelete(
  root: any,
  args: IDeleteComputedFieldOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['computedFieldDelete']> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'computedField');

  return ComputedField.delete(args.input.computedFieldId, txn);
}
