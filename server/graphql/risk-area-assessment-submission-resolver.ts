import { transaction } from 'objection';
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
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'create', 'riskAreaAssessmentSubmission');
  checkUserLoggedIn(userId);

  return await RiskAreaAssessmentSubmission.autoOpenIfRequired(
    {
      ...input,
      userId: userId!,
    },
    txn,
  );
}

export async function riskAreaAssessmentSubmissionComplete(
  root: any,
  { input }: IRiskAreaAssessmentSubmissionCompleteArgs,
  context: IContext,
) {
  return transaction(context.txn || RiskAreaAssessmentSubmission.knex(), async newTxn => {
    const { userRole, userId } = context;

    await accessControls.isAllowed(userRole, 'create', 'riskAreaAssessmentSubmission');
    checkUserLoggedIn(userId);

    return await RiskAreaAssessmentSubmission.complete(
      input.riskAreaAssessmentSubmissionId,
      newTxn,
    );
  });
}

export async function resolveRiskAreaAssessmentSubmission(
  root: any,
  args: { riskAreaAssessmentSubmissionId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaAssessmentSubmission');

  return await RiskAreaAssessmentSubmission.get(args.riskAreaAssessmentSubmissionId, txn);
}

export async function resolveRiskAreaAssessmentSubmissionForPatient(
  root: any,
  args: { riskAreaId: string; patientId: string; completed: boolean },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'riskAreaAssessmentSubmission');

  return await RiskAreaAssessmentSubmission.getLatestForPatient(
    args.riskAreaId,
    args.patientId,
    args.completed,
    txn,
  );
}
