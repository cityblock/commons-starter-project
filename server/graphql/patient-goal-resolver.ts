import { pickBy } from 'lodash';
import { IPatientGoalCreateInput, IPatientGoalDeleteInput, IPatientGoalEditInput } from 'schema';
import PatientGoal from '../models/patient-goal';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IPatientGoalCreateArgs {
  input: IPatientGoalCreateInput;
}

export interface IResolvePatientGoalOptions {
  patientGoalId: string;
}

export interface IEditPatientGoalOptions {
  input: IPatientGoalEditInput;
}

export interface IDeletePatientGoalOptions {
  input: IPatientGoalDeleteInput;
}

export async function patientGoalCreate(
  root: any,
  { input }: IPatientGoalCreateArgs,
  { userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'patientGoal');

  return await PatientGoal.create(input as any);
}

export async function resolvePatientGoal(
  root: any,
  args: { patientGoalId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientGoal');

  return await PatientGoal.get(args.patientGoalId);
}

export async function resolvePatientGoalsForPatient(
  root: any,
  args: { patientId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientGoal');

  return await PatientGoal.getForPatient(args.patientId);
}

export async function patientGoalEdit(
  root: any,
  args: IEditPatientGoalOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');

  // TODO: fix typings here
  const cleanedParams = pickBy<IPatientGoalEditInput, {}>(args.input) as any;
  return PatientGoal.update(args.input.patientGoalId, cleanedParams);
}

export async function patientGoalDelete(
  root: any,
  args: IDeletePatientGoalOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');

  return PatientGoal.delete(args.input.patientGoalId);
}
