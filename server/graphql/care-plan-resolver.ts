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
  riskAreaId?: string;
  glassBreakId: string | null;
}

export interface IResolveCarePlanOptions {
  patientId: string;
  glassBreakId: string | null;
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

export async function resolveCarePlanSuggestionsForPatient(
  root: any,
  args: IResolveCarePlanSuggestionsOptions,
  { db, userId, permissions, txn }: IContext,
): Promise<IRootQueryType['carePlanSuggestionsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);
  await validateGlassBreak(userId!, permissions, 'patient', args.patientId, txn, args.glassBreakId);

  return CarePlanSuggestion.getForPatient(args.patientId, txn);
}

export async function resolveCarePlanForPatient(
  root: any,
  args: IResolveCarePlanOptions,
  { db, userId, permissions, txn }: IContext,
): Promise<IRootQueryType['carePlanForPatient']> {
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
}

export async function carePlanSuggestionDismiss(
  root: any,
  { input }: ICarePlanSuggestionDismissArgs,
  { db, permissions, userId, txn }: IContext,
): Promise<IRootMutationType['carePlanSuggestionDismiss']> {
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
}

export async function carePlanSuggestionAccept(
  root: any,
  { input }: ICarePlanSuggestionAcceptArgs,
  context: IContext,
): Promise<IRootMutationType['carePlanSuggestionAccept']> {
  const { permissions, userId, txn } = context;
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    input.carePlanSuggestionId,
  );

  const carePlanSuggestion = await CarePlanSuggestion.get(input.carePlanSuggestionId, txn);
  let secondaryCarePlanSuggestions: CarePlanSuggestion[] = [];

  if (!carePlanSuggestion) {
    throw new Error('Suggestion does not exist');
  } else if (carePlanSuggestion.acceptedAt) {
    throw new Error('Suggestion was already accepted');
  }

  const { patientId, goalSuggestionTemplateId } = carePlanSuggestion;
  const { startedAt, concernId, taskTemplateIds } = input;
  let { patientConcernId } = input;

  if (!!carePlanSuggestion.concern && carePlanSuggestion.concernId) {
    await PatientConcern.create(
      {
        concernId: carePlanSuggestion.concernId,
        patientId,
        startedAt: startedAt || undefined,
        userId: userId!,
      },
      txn,
    );
  } else if (!!carePlanSuggestion.goalSuggestionTemplate) {
    if (concernId) {
      const patientConcern = await PatientConcern.create(
        {
          concernId,
          patientId,
          startedAt: startedAt || undefined,
          userId: userId!,
        },
        txn,
      );

      patientConcernId = patientConcern.id;

      secondaryCarePlanSuggestions = await CarePlanSuggestion.findForPatientAndConcern(
        patientId,
        concernId,
        txn,
      );
    }

    await PatientGoal.create(
      {
        userId: userId!,
        goalSuggestionTemplateId: goalSuggestionTemplateId || null,
        patientId: carePlanSuggestion.patientId,
        title: carePlanSuggestion.goalSuggestionTemplate.title,
        patientConcernId: patientConcernId || null,
        taskTemplateIds: taskTemplateIds || [],
      },
      txn,
    );
  }

  await CarePlanSuggestion.accept(carePlanSuggestion, userId!, txn);

  if (secondaryCarePlanSuggestions) {
    await Promise.all([
      secondaryCarePlanSuggestions.forEach(async suggestion =>
        CarePlanSuggestion.accept(suggestion, userId!, txn),
      ),
    ]);
  }

  return carePlanSuggestion || null;
}
