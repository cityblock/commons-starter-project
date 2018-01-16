import { pickBy } from 'lodash';
import {
  IConcernAddDiagnosisCodeInput,
  IConcernCreateInput,
  IConcernDeleteInput,
  IConcernEditInput,
  IConcernRemoveDiagnosisCodeInput,
} from 'schema';
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

export interface IAddDiagnosisCodeArgs {
  input: IConcernAddDiagnosisCodeInput;
}

export interface IRemoveDiagnosisCodeArgs {
  input: IConcernRemoveDiagnosisCodeInput;
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

export async function concernAddDiagnosisCode(
  root: any,
  { input }: IAddDiagnosisCodeArgs,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');
  const { concernId, codesetName, code, version } = input;

  return await Concern.addDiagnosisCode(concernId, { codesetName, code, version }, txn);
}

export async function concernRemoveDiagnosisCode(
  root: any,
  { input }: IRemoveDiagnosisCodeArgs,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');
  const { concernId, diagnosisCodeId } = input;

  return await Concern.removeDiagnosisCode(concernId, diagnosisCodeId, txn);
}
