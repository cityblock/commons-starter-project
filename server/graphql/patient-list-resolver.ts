import {
  IPatientListCreateInput,
  IPatientListDeleteInput,
  IPatientListEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientList from '../models/patient-list';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IPatientListCreateArgs {
  input: IPatientListCreateInput;
}

export interface IEditPatientListOptions {
  input: IPatientListEditInput;
}

export interface IDeletePatientListOptions {
  input: IPatientListDeleteInput;
}

export async function resolvePatientLists(
  root: any,
  args: any,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientLists']> {
  await checkUserPermissions(userId, permissions, 'view', 'patientList', txn);

  return PatientList.getAll(txn);
}

export async function resolvePatientList(
  root: any,
  args: { patientListId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientList']> {
  await checkUserPermissions(userId, permissions, 'view', 'patientList', txn);

  return PatientList.get(args.patientListId, txn);
}

export async function patientListCreate(
  root: any,
  { input }: IPatientListCreateArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientListCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'patientList', txn);

  return PatientList.create(input, txn);
}

export async function patientListEdit(
  root: any,
  { input }: IEditPatientListOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientListEdit']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patientList', txn);

  return PatientList.edit(input as any, input.patientListId, txn);
}

export async function patientListDelete(
  root: any,
  { input }: IDeletePatientListOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientListDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'patientList', txn);

  return PatientList.delete(input.patientListId, txn);
}
