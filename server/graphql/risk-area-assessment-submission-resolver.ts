import {
  IRiskAreaAssessmentSubmissionCompleteInput,
  IRiskAreaAssessmentSubmissionCreateInput,
} from 'schema';
import RiskAreaAssessmentSubmission from '../models/risk-area-assessment-submission';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IRiskAreaAssessmentSubmissionCreateArgs {
  input: IRiskAreaAssessmentSubmissionCreateInput;
}

export interface IRiskAreaAssessmentSubmissionCompleteArgs {
  input: IRiskAreaAssessmentSubmissionCompleteInput;
}

export interface IResolveRiskAreaAssessmentSubmissionOptions {
  riskAreaAssessmentSubmissionId: string;
}

export interface IResolveRiskAreaAssessmentSubmissionsOptions {
  patientId: string;
  screeningToolId?: string;
}

export async function riskAreaAssessmentSubmissionCreate(
  root: any,
  { input }: IRiskAreaAssessmentSubmissionCreateArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskAreaAssessmentSubmission');
  checkUserLoggedIn(userId);

  return await RiskAreaAssessmentSubmission.autoOpenIfRequired({
    ...input,
    userId: userId!,
  });
}

export async function riskAreaAssessmentSubmissionComplete(
  root: any,
  { input }: IRiskAreaAssessmentSubmissionCompleteArgs,
  context: IContext,
) {
  const { userRole, userId } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskAreaAssessmentSubmission');
  checkUserLoggedIn(userId);

  return await RiskAreaAssessmentSubmission.complete(input.riskAreaAssessmentSubmissionId);
}

export async function resolveRiskAreaAssessmentSubmission(
  root: any,
  args: { riskAreaAssessmentSubmissionId: string },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaAssessmentSubmission');

  return await RiskAreaAssessmentSubmission.get(args.riskAreaAssessmentSubmissionId);
}

export async function resolveRiskAreaAssessmentSubmissionForPatient(
  root: any,
  args: { riskAreaId: string; patientId: string; completed: boolean },
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaAssessmentSubmission');

  return await RiskAreaAssessmentSubmission.getLatestForPatient(
    args.riskAreaId,
    args.patientId,
    args.completed,
  );
}
