import { transaction } from 'objection';
import {
  IPatientConcernBulkEditInput,
  IPatientConcernCreateInput,
  IPatientConcernDeleteInput,
  IPatientConcernEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientConcern from '../models/patient-concern';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientConcernCreateArgs {
  input: IPatientConcernCreateInput;
}

export interface IResolvePatientConcernOptions {
  patientConcernId: string;
}

export interface IEditPatientConcernOptions {
  input: IPatientConcernEditInput;
}

export interface IBulkEditPatientConcernOptions {
  input: IPatientConcernBulkEditInput;
}

export interface IDeletePatientConcernOptions {
  input: IPatientConcernDeleteInput;
}

export async function patientConcernCreate(
  root: any,
  { input }: IPatientConcernCreateArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['patientConcernCreate']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    return PatientConcern.create({ userId, ...input } as any, txn);
  });
}

export async function resolvePatientConcern(
  root: any,
  args: { patientConcernId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientConcern']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'view',
      'patientConcern',
      txn,
      args.patientConcernId,
    );

    return PatientConcern.get(args.patientConcernId, txn);
  });
}

export async function resolvePatientConcernsForPatient(
  root: any,
  args: { patientId: string },
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootQueryType['patientConcerns']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

    return PatientConcern.getForPatient(args.patientId, txn);
  });
}

export async function patientConcernEdit(
  root: any,
  args: IEditPatientConcernOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['patientConcernEdit']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'patientConcern',
      txn,
      args.input.patientConcernId,
    );

    // TODO: fix typings here
    return PatientConcern.update(args.input.patientConcernId, args.input as any, userId!, txn);
  });
}

export async function patientConcernBulkEdit(
  root: any,
  args: IBulkEditPatientConcernOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['patientConcernBulkEdit']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, args.input.patientId);

    return PatientConcern.bulkUpdate(args.input.patientConcerns as any, args.input.patientId, txn);
  });
}

export async function patientConcernDelete(
  root: any,
  args: IDeletePatientConcernOptions,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['patientConcernDelete']> {
  return transaction(testTransaction || PatientConcern.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'patientConcern',
      txn,
      args.input.patientConcernId,
    );

    return PatientConcern.delete(args.input.patientConcernId, userId!, txn);
  });
}
