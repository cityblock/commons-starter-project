import {
  IPatientScreeningToolSubmissionCreateInput,
  IPatientScreeningToolSubmissionScoreInput,
} from 'schema';
import PatientAnswer from '../models/patient-answer';
import PatientScreeningToolSubmission from '../models/patient-screening-tool-submission';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IPatientScreeningToolSubmissionCreateArgs {
  input: IPatientScreeningToolSubmissionCreateInput;
}

export interface IPatientScreeningToolSubmissionScoreArgs {
  input: IPatientScreeningToolSubmissionScoreInput;
}

export interface IResolvePatientScreeningToolSubmissionOptions {
  patientScreeningToolSubmissionId: string;
}

export interface IResolvePatientScreeningToolSubmissionsOptions {
  patientId: string;
  screeningToolId?: string;
}

export async function patientScreeningToolSubmissionCreate(
  root: any,
  { input }: IPatientScreeningToolSubmissionCreateArgs,
  context: IContext,
) {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  return PatientScreeningToolSubmission.autoOpenIfRequired(
    {
      ...input,
      userId: userId!,
    },
    txn,
  );
}

export async function patientScreeningToolSubmissionScore(
  root: any,
  { input }: IPatientScreeningToolSubmissionScoreArgs,
  context: IContext,
) {
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  const patientAnswers = await PatientAnswer.getForScreeningToolSubmission(
    input.patientScreeningToolSubmissionId,
    txn,
  );

  return PatientScreeningToolSubmission.submitScore(
    input.patientScreeningToolSubmissionId,
    {
      patientAnswers,
    },
    txn,
  );
}

export async function resolvePatientScreeningToolSubmission(
  root: any,
  args: { patientScreeningToolSubmissionId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return PatientScreeningToolSubmission.get(args.patientScreeningToolSubmissionId, txn);
}

export async function resolvePatientScreeningToolSubmissionForPatientAndScreeningTool(
  root: any,
  args: { screeningToolId: string; patientId: string; scored: boolean },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
    args.screeningToolId,
    args.patientId,
    args.scored,
    txn,
  );
}

export async function resolvePatientScreeningToolSubmissionsForPatient(
  root: any,
  args: IResolvePatientScreeningToolSubmissionsOptions,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  if (args.screeningToolId) {
    return PatientScreeningToolSubmission.getForPatientAndScreeningTool(
      args.patientId,
      args.screeningToolId,
      txn,
    );
  } else {
    return PatientScreeningToolSubmission.getForPatient(args.patientId, txn);
  }
}

export async function resolvePatientScreeningToolSubmissionsFor360(
  root: any,
  args: { patientId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');
  return PatientScreeningToolSubmission.getFor360(args.patientId, txn);
}

export async function resolvePatientScreeningToolSubmissions(
  root: any,
  args: any,
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return PatientScreeningToolSubmission.getAll(txn);
}
