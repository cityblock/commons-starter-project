import { pickBy } from 'lodash';
import { IConcernCreateInput, IConcernDeleteInput, IConcernEditInput } from 'schema';
import Concern, { ConcernOrderOptions } from '../models/concern';
import accessControls from './shared/access-controls';
import { formatOrderOptions, IContext } from './shared/utils';

export interface IConcernCreateArgs {
  input: IConcernCreateInput;
}

export interface IResolveConcernOptions {
  concernId: string;
}

export interface IEditConcernOptions {
  input: IConcernEditInput;
}

export interface IDeleteConcernOptions {
  input: IConcernDeleteInput;
}

export async function concernCreate(root: any, { input }: IConcernCreateArgs, context: IContext) {
  const { userRole } = context;
  await accessControls.isAllowed(userRole, 'create', 'concern');

  return await Concern.create(input);
}

export async function resolveConcern(
  root: any,
  args: { concernId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return await Concern.get(args.concernId);
}

export async function resolveConcerns(root: any, args: any, { db, userRole }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  const { order, orderBy } = formatOrderOptions<ConcernOrderOptions>(args.orderBy, {
    orderBy: 'createdAt',
    order: 'desc',
  });

  return await Concern.getAll({ orderBy, order });
}

export async function concernEdit(
  root: any,
  args: IEditConcernOptions,
  { db, userId, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');

  // TODO: fix typings here
  const cleanedParams = pickBy<IConcernEditInput>(args.input) as any;
  return Concern.edit(args.input.concernId, cleanedParams);
}

export async function concernDelete(
  root: any,
  args: IDeleteConcernOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');

  return Concern.delete(args.input.concernId);
}
