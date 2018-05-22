import { transaction } from 'objection';
import {
  IRiskAreaAssessmentSubmissionCompleteInput,
  IRiskAreaAssessmentSubmissionCreateInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import RiskAreaAssessmentSubmission from '../models/risk-area-assessment-submission';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['riskAreaAssessmentSubmissionCreate']> {
  return transaction(testTransaction || RiskAreaAssessmentSubmission.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, input.patientId);

    return RiskAreaAssessmentSubmission.autoOpenIfRequired(
      {
        ...input,
        userId: userId!,
      },
      txn,
    );
  });
}

export async function riskAreaAssessmentSubmissionComplete(
  root: any,
  { input }: IRiskAreaAssessmentSubmissionCompleteArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['riskAreaAssessmentSubmissionComplete']> {
  return transaction(testTransaction || RiskAreaAssessmentSubmission.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'riskAreaAssessmentSubmission',
      txn,
      input.riskAreaAssessmentSubmissionId,
    );

    return RiskAreaAssessmentSubmission.complete(input.riskAreaAssessmentSubmissionId, txn);
  });
}

export async function resolveRiskAreaAssessmentSubmission(
  root: any,
  args: { riskAreaAssessmentSubmissionId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaAssessmentSubmission']> {
  return transaction(testTransaction || RiskAreaAssessmentSubmission.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'riskAreaAssessmentSubmission',
      txn,
      args.riskAreaAssessmentSubmissionId,
    );

    return RiskAreaAssessmentSubmission.get(args.riskAreaAssessmentSubmissionId, txn);
  });
}

export async function resolveRiskAreaAssessmentSubmissionForPatient(
  root: any,
  args: { riskAreaId: string; patientId: string; completed: boolean },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['riskAreaAssessmentSubmissionForPatient']> {
  return transaction(testTransaction || RiskAreaAssessmentSubmission.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

    return RiskAreaAssessmentSubmission.getLatestForPatient(
      args.riskAreaId,
      args.patientId,
      args.completed,
      txn,
    );
  });
}
