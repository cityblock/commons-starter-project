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
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  return await PatientScreeningToolSubmission.autoOpenIfRequired({
    ...input,
    userId: userId!,
  });
}

export async function patientScreeningToolSubmissionScore(
  root: any,
  { input }: IPatientScreeningToolSubmissionScoreArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'patientScreeningToolSubmission');
  checkUserLoggedIn(userId);

  const patientAnswers = await PatientAnswer.getForScreeningToolSubmission(
    input.patientScreeningToolSubmissionId,
  );

  return await PatientScreeningToolSubmission.submitScore(input.patientScreeningToolSubmissionId, {
    patientAnswers,
  });
}

export async function resolvePatientScreeningToolSubmission(
  root: any,
  args: { patientScreeningToolSubmissionId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.get(args.patientScreeningToolSubmissionId);
}

export async function resolvePatientScreeningToolSubmissionForPatientAndScreeningTool(
  root: any,
  args: { screeningToolId: string; patientId: string; scored: boolean },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getLatestForPatientAndScreeningTool(
    args.screeningToolId,
    args.patientId,
    args.scored,
  );
}

export async function resolvePatientScreeningToolSubmissionsForPatient(
  root: any,
  args: IResolvePatientScreeningToolSubmissionsOptions,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getForPatient(args.patientId, args.screeningToolId);
}

export async function resolvePatientScreeningToolSubmissions(
  root: any,
  args: any,
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'patientScreeningToolSubmission');

  return await PatientScreeningToolSubmission.getAll();
}
