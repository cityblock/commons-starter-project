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
  { db, userRole, txn }: IContext,
): Promise<CarePlanSuggestion[]> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

  return await CarePlanSuggestion.getForPatient(args.patientId, txn);
}

export async function resolveCarePlanForPatient(
  root: any,
  args: IResolveCarePlanOptions,
  { db, userRole, txn }: IContext,
): Promise<ICarePlan> {
  await accessControls.isAllowed(userRole, 'view', 'carePlanSuggestion');

  const concerns = await PatientConcern.getForPatient(args.patientId, txn);
  const goals = await PatientGoal.getForPatient(args.patientId, txn);

  return {
    concerns,
    goals,
  } as ICarePlan;
}

export async function carePlanSuggestionDismiss(
  root: any,
  { input }: ICarePlanSuggestionDismissArgs,
  { db, userRole, userId, txn }: IContext,
): Promise<CarePlanSuggestion | undefined> {
  await accessControls.isAllowed(userRole, 'edit', 'carePlanSuggestion');
  checkUserLoggedIn(userId);

  return await CarePlanSuggestion.dismiss(
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
): Promise<CarePlanSuggestion | undefined> {
  const { userRole, userId } = context;
  const existingTxn = context.txn;
  await accessControls.isAllowed(userRole, 'edit', 'patient');
  checkUserLoggedIn(userId);

  return await transaction(CarePlanSuggestion.knex(), async txn => {
    const carePlanSuggestion = await CarePlanSuggestion.get(
      input.carePlanSuggestionId,
      existingTxn || txn,
    );
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
          existingTxn || txn,
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
            existingTxn || txn,
          );

          patientConcernId = patientConcern.id;

          secondaryCarePlanSuggestion = await CarePlanSuggestion.findForPatientAndConcern(
            patientId,
            concernId,
            existingTxn || txn,
          );
        }

        await PatientGoal.create(
          {
            userId: userId!,
            goalSuggestionTemplateId,
            patientId: carePlanSuggestion.patientId,
            title: carePlanSuggestion.goalSuggestionTemplate.title,
            patientConcernId: patientConcernId || undefined,
            taskTemplateIds: taskTemplateIds || [],
          },
          existingTxn || txn,
        );
      }

      await CarePlanSuggestion.accept(carePlanSuggestion.id, userId!, existingTxn || txn);

      if (secondaryCarePlanSuggestion) {
        await CarePlanSuggestion.accept(
          secondaryCarePlanSuggestion.id,
          userId!,
          existingTxn || txn,
        );
      }
    }

    return carePlanSuggestion;
  });
}
