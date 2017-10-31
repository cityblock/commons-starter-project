import { omit } from 'lodash';
import { transaction } from 'objection';
import { ICarePlan, ICarePlanSuggestionAcceptInput, ICarePlanSuggestionDismissInput } from 'schema';
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
  { db, userRole }: IContext,
): Promise<CarePlanSuggestion[]> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

  return await CarePlanSuggestion.getForPatient(args.patientId);
}

export async function resolveCarePlanForPatient(
  root: any,
  args: IResolveCarePlanOptions,
  { db, userRole }: IContext,
): Promise<ICarePlan> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

  const concerns = await PatientConcern.getForPatient(args.patientId);
  const goals = await PatientGoal.getForPatient(args.patientId);

  return {
    concerns,
    goals,
  } as ICarePlan;
}

export async function carePlanSuggestionDismiss(
  root: any,
  { input }: ICarePlanSuggestionDismissArgs,
  { db, userRole, userId }: IContext,
): Promise<CarePlanSuggestion | undefined> {
  await accessControls.isAllowed(userRole, 'edit', 'carePlanSuggestion');
  checkUserLoggedIn(userId);

  return await CarePlanSuggestion.dismiss({
    carePlanSuggestionId: input.carePlanSuggestionId,
    dismissedById: userId!,
    dismissedReason: input.dismissedReason,
  });
}

export async function carePlanSuggestionAccept(
  root: any,
  { input }: ICarePlanSuggestionAcceptArgs,
  { db, userRole, userId }: IContext,
): Promise<CarePlanSuggestion | undefined> {
  await accessControls.isAllowed(userRole, 'edit', 'patient');
  checkUserLoggedIn(userId);

  return await transaction(CarePlanSuggestion.knex(), async txn => {
    const carePlanSuggestion = await CarePlanSuggestion.get(input.carePlanSuggestionId, txn);
    let secondaryCarePlanSuggestion: CarePlanSuggestion | undefined;

    if (carePlanSuggestion) {
      const { patientId, goalSuggestionTemplateId } = carePlanSuggestion;
      const { concernTitle, startedAt, concernId } = input;

      if (!!carePlanSuggestion.concern && carePlanSuggestion.concernId) {
        await PatientConcern.create({
          concernId: carePlanSuggestion.concernId,
          patientId,
          startedAt: startedAt || undefined,
          userId: userId!,
        });
      } else if (!!carePlanSuggestion.goalSuggestionTemplate) {
        const patientGoalCreateInput: any = Object.assign(
          omit<{}, any>(input, ['concernTitle', 'concernId', 'startedAt', 'carePlanSuggestionId']),
          {
            userId,
            goalSuggestionTemplateId,
            patientId: carePlanSuggestion.patientId,
            title: carePlanSuggestion.goalSuggestionTemplate.title,
          },
        );

        if (concernTitle) {
          const concern = await Concern.findOrCreateByTitle(concernTitle, txn);

          const patientConcern = await PatientConcern.create(
            {
              concernId: concern.id,
              patientId,
              startedAt: startedAt || undefined,
              userId: userId!,
            },
            txn,
          );

          patientGoalCreateInput.patientConcernId = patientConcern.id;
        } else if (concernId) {
          const patientConcern = await PatientConcern.create(
            {
              concernId,
              patientId,
              startedAt: startedAt || undefined,
              userId: userId!,
            },
            txn,
          );

          patientGoalCreateInput.patientConcernId = patientConcern.id;

          secondaryCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
            patientId,
            concernId,
          );
        }

        await PatientGoal.create(patientGoalCreateInput, txn);
      }

      await CarePlanSuggestion.accept(carePlanSuggestion.id, userId!, txn);

      if (secondaryCarePlanSuggestion) {
        await CarePlanSuggestion.accept(secondaryCarePlanSuggestion.id, userId!, txn);
      }
    }

    return carePlanSuggestion;
  });
}
