import { pickBy } from 'lodash';
import {
  IPatientConcernBulkEditInput,
  IPatientConcernCreateInput,
  IPatientConcernDeleteInput,
  IPatientConcernEditInput,
} from 'schema';
import PatientConcern from '../models/patient-concern';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientConcern');
  checkUserLoggedIn(userId);

  return await PatientConcern.create({ userId, ...input } as any);
}

export async function resolvePatientConcern(
  root: any,
  args: { patientConcernId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientConcern');

  return await PatientConcern.get(args.patientConcernId);
}

export async function resolvePatientConcernsForPatient(
  root: any,
  args: { patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientConcern');

  return await PatientConcern.getForPatient(args.patientId);
}

export async function patientConcernEdit(
  root: any,
  args: IEditPatientConcernOptions,
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientConcern');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  const cleanedParams = pickBy<IPatientConcernEditInput>(args.input) as any;
  return PatientConcern.update(args.input.patientConcernId, cleanedParams, userId!);
}

export async function patientConcernBulkEdit(
  root: any,
  args: IBulkEditPatientConcernOptions,
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientConcern');
  checkUserLoggedIn(userId);
  return PatientConcern.bulkUpdate(args.input.patientConcerns as any, args.input.patientId);
}

export async function patientConcernDelete(
  root: any,
  args: IDeletePatientConcernOptions,
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientConcern');
  checkUserLoggedIn(userId);

  return PatientConcern.delete(args.input.patientConcernId, userId!);
}
