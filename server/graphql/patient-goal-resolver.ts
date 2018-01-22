import { omit } from 'lodash';
import { IPatientGoalCreateInput, IPatientGoalDeleteInput, IPatientGoalEditInput } from 'schema';
import Concern from '../models/concern';
import PatientConcern from '../models/patient-concern';
import PatientGoal from '../models/patient-goal';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

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
  context: IContext,
) {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientGoal');
  checkUserLoggedIn(userId);

  const { concernTitle, concernId, patientId, startedAt } = input;
  const validInput: any = omit(input, ['concernTitle, concernId, startedAt']);

  // A new concern is getting created
  if (concernTitle) {
    const concern = await Concern.create({ title: concernTitle }, txn);
    const patientConcern = await PatientConcern.create(
      {
        concernId: concern.id,
        patientId,
        userId: userId!,
        startedAt: startedAt || undefined,
      },
      txn,
    );
    (validInput as any).patientConcernId = patientConcern.id;
    // This goal is getting associated with an existing concern
  } else if (concernId) {
    const patientConcern = await PatientConcern.create(
      {
        concernId,
        patientId,
        userId: userId!,
        startedAt: startedAt || undefined,
      },
      txn,
    );
    (validInput as any).patientConcernId = patientConcern.id;
  }

  (validInput as any).userId = userId;

  return await PatientGoal.create(validInput as any, txn);
}

export async function resolvePatientGoal(
  root: any,
  args: { patientGoalId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientGoal');

  return await PatientGoal.get(args.patientGoalId, txn);
}

export async function resolvePatientGoalsForPatient(
  root: any,
  args: { patientId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientGoal');

  return await PatientGoal.getForPatient(args.patientId, txn);
}

export async function patientGoalEdit(
  root: any,
  args: IEditPatientGoalOptions,
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return PatientGoal.update(args.input.patientGoalId, args.input as any, userId!, txn);
}

export async function patientGoalDelete(
  root: any,
  args: IDeletePatientGoalOptions,
  { db, userRole, userId, txn }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');
  checkUserLoggedIn(userId);

  return PatientGoal.delete(args.input.patientGoalId, userId!, txn);
}
