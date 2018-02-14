import { omit } from 'lodash';
import {
  IPatientGoalCreateInput,
  IPatientGoalDeleteInput,
  IPatientGoalEditInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import Concern from '../models/concern';
import PatientConcern from '../models/patient-concern';
import PatientGoal from '../models/patient-goal';
import checkUserPermissions from './shared/permissions-check';
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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientGoalCreate']> {
  const { concernTitle, concernId, patientId, startedAt } = input;

  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

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
    validInput.patientConcernId = patientConcern.id;
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
    validInput.patientConcernId = patientConcern.id;
  }

  validInput.userId = userId;

  return PatientGoal.create(validInput, txn);
}

export async function resolvePatientGoal(
  root: any,
  args: { patientGoalId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientGoal']> {
  await checkUserPermissions(userId, permissions, 'view', 'patientGoal', txn, args.patientGoalId);

  return PatientGoal.get(args.patientGoalId, txn);
}

export async function resolvePatientGoalsForPatient(
  root: any,
  args: { patientId: string },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientGoals']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return PatientGoal.getForPatient(args.patientId, txn);
}

export async function patientGoalEdit(
  root: any,
  args: IEditPatientGoalOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientGoalEdit']> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patientGoal',
    txn,
    args.input.patientGoalId,
  );

  return PatientGoal.update(args.input.patientGoalId, args.input, userId!, txn);
}

export async function patientGoalDelete(
  root: any,
  args: IDeletePatientGoalOptions,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientGoalDelete']> {
  await checkUserPermissions(
    userId,
    permissions,
    'delete',
    'patientGoal',
    txn,
    args.input.patientGoalId,
  );

  return PatientGoal.delete(args.input.patientGoalId, userId!, txn);
}
