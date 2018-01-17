import { omit } from 'lodash';
import { transaction } from 'objection';
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
  { userRole, userId }: IContext,
) {
  await accessControls.isAllowed(userRole, 'create', 'patientGoal');
  checkUserLoggedIn(userId);

  const { concernTitle, concernId, patientId, startedAt } = input;
  const validInput: any = omit(input, ['concernTitle, concernId, startedAt']);

  return await transaction(PatientGoal.knex(), async txn => {
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
  });
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
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');
  checkUserLoggedIn(userId);

  // TODO: fix typings here
  return PatientGoal.update(args.input.patientGoalId, args.input as any, userId!);
}

export async function patientGoalDelete(
  root: any,
  args: IDeletePatientGoalOptions,
  { db, userRole, userId }: IContext,
) {
  await accessControls.isAllowedForUser(userRole, 'edit', 'patientGoal');
  checkUserLoggedIn(userId);

  return PatientGoal.delete(args.input.patientGoalId, userId!);
}
