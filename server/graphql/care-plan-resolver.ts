import { transaction } from 'objection';
import {
  ICarePlanSuggestionAcceptInput,
  ICarePlanSuggestionDismissInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import CarePlanSuggestion from '../models/care-plan-suggestion';
import Concern from '../models/concern';
import GoalSuggestionTemplate from '../models/goal-suggestion-template';
import PatientConcern from '../models/patient-concern';
import PatientGlassBreak from '../models/patient-glass-break';
import PatientGoal from '../models/patient-goal';
import checkUserPermissions, { validateGlassBreak } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolveCarePlanSuggestionsOptions {
  patientId: string;
  glassBreakId: string | null;
}

export interface IResolveCarePlanOptions {
  patientId: string;
  glassBreakId: string | null;
  riskAreaId: string;
}

export interface ISuggestionsForPatient {
  concernSuggestions: Concern[];
  goalSuggestions: GoalSuggestionTemplate[];
}

export interface ICarePlanSuggestionAcceptArgs {
  input: ICarePlanSuggestionAcceptInput;
}

export interface ICarePlanSuggestionDismissArgs {
  input: ICarePlanSuggestionDismissInput;
}

export async function resolveCarePlanSuggestionsFromRiskAreaAssessmentsForPatient(
  root: any,
  args: IResolveCarePlanSuggestionsOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['carePlanSuggestionsFromRiskAreaAssessmentsForPatient']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    return CarePlanSuggestion.getFromRiskAreaAssessmentsForPatient(args.patientId, txn);
  });
}

export async function resolveCarePlanSuggestionsFromScreeningToolsForPatient(
  root: any,
  args: IResolveCarePlanSuggestionsOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['carePlanSuggestionsFromScreeningToolsForPatient']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    return CarePlanSuggestion.getFromScreeningToolsForPatient(args.patientId, txn);
  });
}

export async function resolveCarePlanSuggestionsFromComputedFieldsForPatient(
  root: any,
  args: IResolveCarePlanSuggestionsOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['carePlanSuggestionsFromComputedFieldsForPatient']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
    await validateGlassBreak(
      userId!,
      permissions,
      'patient',
      args.patientId,
      txn,
      args.glassBreakId,
    );

    return CarePlanSuggestion.getFromComputedFieldsForPatient(args.patientId, txn);
  });
}

export async function resolveCarePlanForPatient(
  root: any,
  args: IResolveCarePlanOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['carePlanForPatient']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

    let glassBreakId = args.glassBreakId;

    if (!glassBreakId) {
      // load the current glass break for user and patient if none provided (refetch query)
      const glassBreaks = await PatientGlassBreak.getForCurrentUserPatientSession(
        userId!,
        args.patientId,
        txn,
      );
      glassBreakId = glassBreaks && glassBreaks.length ? glassBreaks[0].id : null;
    }

    await validateGlassBreak(userId!, permissions, 'patient', args.patientId, txn, glassBreakId);

    const concerns = await PatientConcern.getForPatient(args.patientId, txn);
    const goals = await PatientGoal.getForPatient(args.patientId, txn);

    return {
      concerns,
      goals,
    };
  });
}

export async function carePlanSuggestionDismiss(
  root: any,
  { input }: ICarePlanSuggestionDismissArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['carePlanSuggestionDismiss']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'carePlanSuggestion',
      txn,
      input.carePlanSuggestionId,
    );

    return CarePlanSuggestion.dismiss(
      {
        carePlanSuggestionId: input.carePlanSuggestionId,
        dismissedById: userId!,
        dismissedReason: input.dismissedReason,
      },
      txn,
    );
  });
}

export async function carePlanSuggestionAccept(
  root: any,
  { input }: ICarePlanSuggestionAcceptArgs,
  { permissions, userId, testTransaction }: IContext,
): Promise<IRootMutationType['carePlanSuggestionAccept']> {
  return transaction(testTransaction || CarePlanSuggestion.knex(), async txn => {
    await checkUserPermissions(
      userId,
      permissions,
      'edit',
      'patient',
      txn,
      input.carePlanSuggestionId,
    );

    const carePlanSuggestion = await CarePlanSuggestion.get(input.carePlanSuggestionId, txn);

    if (!carePlanSuggestion) {
      throw new Error('Suggestion does not exist');
    } else if (carePlanSuggestion.acceptedAt) {
      throw new Error('Suggestion was already accepted');
    }

    const { patientId, goalSuggestionTemplateId } = carePlanSuggestion;
    const { startedAt, taskTemplateIds } = input;
    let { patientConcernId } = input;

    const concernToAcceptId = carePlanSuggestion.concernId || input.concernId;
    if (concernToAcceptId) {
      const patientConcern = await PatientConcern.create(
        {
          concernId: concernToAcceptId,
          patientId,
          startedAt: startedAt || undefined,
          userId: userId!,
        },
        txn,
      );
      patientConcernId = patientConcern.id;
      await CarePlanSuggestion.acceptForConcern(
        {
          concernId: concernToAcceptId,
          patientId,
          acceptedById: userId!,
        },
        txn,
      );
    }

    if (carePlanSuggestion.goalSuggestionTemplate) {
      if (!patientConcernId) {
        throw new Error('patientConcernId is required');
      }

      await PatientGoal.create(
        {
          userId: userId!,
          goalSuggestionTemplateId: goalSuggestionTemplateId || null,
          patientId: carePlanSuggestion.patientId,
          title: carePlanSuggestion.goalSuggestionTemplate.title,
          patientConcernId,
          taskTemplateIds: taskTemplateIds || [],
        },
        txn,
      );
      await CarePlanSuggestion.acceptForGoal(
        {
          goalSuggestionTemplateId: carePlanSuggestion.goalSuggestionTemplate.id,
          patientId,
          acceptedById: userId!,
        },
        txn,
      );
    }

    return carePlanSuggestion || null;
  });
}
