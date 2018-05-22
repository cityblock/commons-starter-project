import { transaction } from 'objection';
import {
  IConcernAddDiagnosisCodeInput,
  IConcernCreateInput,
  IConcernDeleteInput,
  IConcernEditInput,
  IConcernRemoveDiagnosisCodeInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Concern, { ConcernOrderOptions } from '../models/concern';
import checkUserPermissions from './shared/permissions-check';
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

export async function concernCreate(
  root: any,
  { input }: IConcernCreateArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernCreate']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'concern', txn);

    return Concern.create(input, txn);
  });
}

export async function resolveConcern(
  root: any,
  args: { concernId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['concern']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'concern', txn);

    return Concern.get(args.concernId, txn);
  });
}

export async function resolveConcerns(
  root: any,
  args: any,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['concerns']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'concern', txn);

    const { order, orderBy } = formatOrderOptions<ConcernOrderOptions>(args.orderBy, {
      orderBy: 'title',
      order: 'asc',
    });

    return Concern.getAll({ orderBy, order }, txn);
  });
}

export async function concernEdit(
  root: any,
  args: IEditConcernOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernEdit']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'concern', txn);

    return Concern.edit(args.input.concernId, args.input, txn);
  });
}

export async function concernDelete(
  root: any,
  args: IDeleteConcernOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernDelete']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'concern', txn);

    return Concern.delete(args.input.concernId, txn);
  });
}

export async function concernAddDiagnosisCode(
  root: any,
  { input }: IAddDiagnosisCodeArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernAddDiagnosisCode']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'concern', txn);
    const { concernId, codesetName, code, version } = input;

    return Concern.addDiagnosisCode(concernId, { codesetName, code, version }, txn);
  });
}

export async function concernRemoveDiagnosisCode(
  root: any,
  { input }: IRemoveDiagnosisCodeArgs,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernRemoveDiagnosisCode']> {
  return transaction(testTransaction || Concern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'concern', txn);
    const { concernId, diagnosisCodeId } = input;

    return Concern.removeDiagnosisCode(concernId, diagnosisCodeId, txn);
  });
}
