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
  const { userRole, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'concern');

  return Concern.create(input, txn);
}

export async function resolveConcern(
  root: any,
  args: { concernId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return Concern.get(args.concernId, txn);
}

export async function resolveConcerns(root: any, args: any, { db, userRole, txn }: IContext) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  const { order, orderBy } = formatOrderOptions<ConcernOrderOptions>(args.orderBy, {
    orderBy: 'createdAt',
    order: 'desc',
  });

  return Concern.getAll({ orderBy, order }, txn);
}

export async function concernEdit(
  root: any,
  args: IEditConcernOptions,
  { db, userId, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');

  return Concern.edit(args.input.concernId, args.input, txn);
}

export async function concernDelete(
  root: any,
  args: IDeleteConcernOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');

  return Concern.delete(args.input.concernId, txn);
}

export async function concernAddDiagnosisCode(
  root: any,
  { input }: IAddDiagnosisCodeArgs,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');
  const { concernId, codesetName, code, version } = input;

  return Concern.addDiagnosisCode(concernId, { codesetName, code, version }, txn);
}

export async function concernRemoveDiagnosisCode(
  root: any,
  { input }: IRemoveDiagnosisCodeArgs,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'concern');
  const { concernId, diagnosisCodeId } = input;

  return Concern.removeDiagnosisCode(concernId, diagnosisCodeId, txn);
}
