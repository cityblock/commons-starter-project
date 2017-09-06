import { pickBy } from 'lodash';
import {
  IPatientConcernCreateInput,
  IPatientConcernDeleteInput,
  IPatientConcernEditInput,
} from 'schema';
import PatientConcern from '../models/patient-concern';
import accessControls from './shared/access-controls';
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

export interface IDeletePatientConcernOptions {
  input: IPatientConcernDeleteInput;
}

export async function patientConcernCreate(
  root: any,
  { input }: IPatientConcernCreateArgs,
  context: IContext,
) {
  const { userRole } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientConcern');

  return await PatientConcern.create(input as any);
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
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientConcern');

  // TODO: fix typings here
  const cleanedParams = pickBy<IPatientConcernEditInput, {}>(args.input) as any;
  return PatientConcern.update(args.input.patientConcernId, cleanedParams);
}

export async function patientConcernDelete(
  root: any,
  args: IDeletePatientConcernOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientConcern');

  return PatientConcern.delete(args.input.patientConcernId);
}
