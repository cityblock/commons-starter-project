import {
  IPatientScreeningToolSubmissionCreateInput,
  IPatientScreeningToolSubmissionScoreInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import PatientAnswer from '../models/patient-answer';
import PatientScreeningToolSubmission from '../models/patient-screening-tool-submission';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientScreeningToolSubmissionCreate']> {
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

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
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientScreeningToolSubmissionScore']> {
  await checkUserPermissions(
    userId,
    permissions,
    'view',
    'patientScreeningToolSubmission',
    txn,
    input.patientScreeningToolSubmissionId,
  );

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
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScreeningToolSubmission']> {
  await checkUserPermissions(
    userId,
    permissions,
    'view',
    'patientScreeningToolSubmission',
    txn,
    args.patientScreeningToolSubmissionId,
  );

  return PatientScreeningToolSubmission.get(args.patientScreeningToolSubmissionId, txn);
}

export async function resolvePatientScreeningToolSubmissionForPatientAndScreeningTool(
  root: any,
  args: { screeningToolId: string; patientId: string; scored: boolean },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScreeningToolSubmissionForPatientAndScreeningTool']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

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
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScreeningToolSubmissionsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

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
  args: { patientId: string; glassBreakId: string | null },
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScreeningToolSubmissionsFor360']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
  await validateGlassBreak(userId!, permissions, 'patient', args.patientId, txn, args.glassBreakId);

  return PatientScreeningToolSubmission.getFor360(args.patientId, txn);
}

export async function resolvePatientScreeningToolSubmissions(
  root: any,
  args: any,
  { permissions, userId, txn }: IContext,
): Promise<IRootQueryType['patientScreeningToolSubmissions']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return PatientScreeningToolSubmission.getAll(txn);
}
