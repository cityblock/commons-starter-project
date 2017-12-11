import { kebabCase } from 'lodash';
import { IComputedFieldCreateInput, IComputedFieldDeleteInput } from 'schema';
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
  availableOnly?: boolean;
}

export interface IDeleteComputedFieldOptions {
  input: IComputedFieldDeleteInput;
}

export async function computedFieldCreate(
  root: any,
  { input }: IComputedFieldCreateArgs,
  context: IContext,
) {
  const { userRole } = context;
  await accessControls.isAllowed(userRole, 'create', 'computedField');

  const slug = kebabCase(input.label);

  return await ComputedField.create({ slug, ...input });
}

export async function resolveComputedField(
  root: any,
  args: IResolveComputedFieldOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'computedField');

  return await ComputedField.get(args.computedFieldId);
}

export async function resolveComputedFields(
  root: any,
  args: IResolveComputedFieldsOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'computedField');

  const { order, orderBy } = formatOrderOptions<ComputedFieldOrderOptions>(args.orderBy, {
    orderBy: 'createdAt',
    order: 'desc',
  });

  if (args.availableOnly) {
    return await ComputedField.getAllAvailable({ orderBy, order });
  } else {
    return await ComputedField.getAll({ orderBy, order });
  }
}

export async function computedFieldDelete(
  root: any,
  args: IDeleteComputedFieldOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'computedField');

  return await ComputedField.delete(args.input.computedFieldId);
}
