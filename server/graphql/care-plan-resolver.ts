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
import PatientGoal from '../models/patient-goal';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

export interface IResolveCarePlanSuggestionsOptions {
  patientId: string;
  riskAreaId?: string;
}

export interface IResolveCarePlanOptions {
  patientId: string;
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
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['carePlanSuggestionsForPatient']> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

  return CarePlanSuggestion.getForPatient(args.patientId, txn);
}

export async function resolveCarePlanForPatient(
  root: any,
  args: IResolveCarePlanOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['carePlanForPatient']> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

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
  { db, userRole, userId, txn }: IContext,
): Promise<IRootMutationType['carePlanSuggestionDismiss']> {
  await accessControls.isAllowed(userRole, 'edit', 'carePlanSuggestion');
  checkUserLoggedIn(userId);

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
  const { userRole, userId, txn } = context;
  await accessControls.isAllowed(userRole, 'edit', 'patient');
  checkUserLoggedIn(userId);

  const carePlanSuggestion = await CarePlanSuggestion.get(input.carePlanSuggestionId, txn);
  let secondaryCarePlanSuggestion: CarePlanSuggestion | undefined;

  if (carePlanSuggestion) {
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

        secondaryCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
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

    if (secondaryCarePlanSuggestion) {
      await CarePlanSuggestion.accept(secondaryCarePlanSuggestion, userId!, txn);
    }
  }

  return carePlanSuggestion || null;
}
