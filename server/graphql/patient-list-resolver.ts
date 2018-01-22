import { IPatientListCreateInput, IPatientListDeleteInput, IPatientListEditInput } from 'schema';
import PatientList from '../models/patient-list';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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
  { db, userRole, userId, txn }: IContext,
): Promise<PatientList[]> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patientList');
  checkUserLoggedIn(userId);

  return await PatientList.getAll(txn);
}

export async function resolvePatientList(
  root: any,
  args: { patientListId: string },
  { db, userRole, userId, txn }: IContext,
): Promise<PatientList> {
  await accessControls.isAllowedForUser(userRole, 'view', 'patientList');
  checkUserLoggedIn(userId);

  return await PatientList.get(args.patientListId, txn);
}

export async function patientListCreate(
  root: any,
  { input }: IPatientListCreateArgs,
  { db, userRole, userId, txn }: IContext,
): Promise<PatientList> {
  await accessControls.isAllowedForUser(userRole, 'create', 'patientList');
  checkUserLoggedIn(userId);

  return await PatientList.create(input, txn);
}

export async function patientListEdit(
  root: any,
  { input }: IEditPatientListOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<PatientList> {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientList');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return await PatientList.edit(input as any, input.patientListId, txn);
}

export async function patientListDelete(
  root: any,
  { input }: IDeletePatientListOptions,
  { db, userRole, userId, txn }: IContext,
): Promise<PatientList> {
  await accessControls.isAllowedForUser(userRole, 'delete', 'patientList');
  checkUserLoggedIn(userId);

  return await PatientList.delete(input.patientListId, txn);
}
