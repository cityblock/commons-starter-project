import { transaction } from 'objection';
import { IPatientTaskSuggestionAcceptInput, IPatientTaskSuggestionDismissInput } from 'schema';
import { createTaskForTaskTemplate } from '../lib/create-task-for-task-template';
import PatientTaskSuggestion from '../models/patient-task-suggestion';
import TaskTemplate from '../models/task-template';
import accessControls from './shared/access-controls';
import { checkUserLoggedIn, IContext } from './shared/utils';

interface IResolveTaskSuggestionsOptions {
  patientId: string;
}

interface IPatientTaskSuggestionAcceptArgs {
  input: IPatientTaskSuggestionAcceptInput;
}

interface IPatientTaskSuggestionDismissArgs {
  input: IPatientTaskSuggestionDismissInput;
}

export async function resolvePatientTaskSuggestions(
  root: any,
  args: IResolveTaskSuggestionsOptions,
  { db, userRole, userId }: IContext,
): Promise<PatientTaskSuggestion[]> {
  await accessControls.isAllowed(userRole, 'view', 'patientTaskSuggestion');
  checkUserLoggedIn(userId);

  return await PatientTaskSuggestion.getForPatient(args.patientId);
}

export async function patientTaskSuggestionDismiss(
  root: any,
  { input }: IPatientTaskSuggestionDismissArgs,
  { db, userRole, userId }: IContext,
): Promise<PatientTaskSuggestion | undefined> {
  await accessControls.isAllowed(userRole, 'edit', 'patientTaskSuggestion');
  checkUserLoggedIn(userId);

  return await PatientTaskSuggestion.dismiss({
    patientTaskSuggestionId: input.patientTaskSuggestionId,
    dismissedById: userId!,
    dismissedReason: input.dismissedReason,
  });
}

export async function patientTaskSuggestionAccept(
  root: any,
  { input }: IPatientTaskSuggestionAcceptArgs,
  { db, userRole, userId }: IContext,
): Promise<PatientTaskSuggestion | undefined> {
  await accessControls.isAllowed(userRole, 'edit', 'patientTaskSuggestion');
  checkUserLoggedIn(userId);

  return await transaction(PatientTaskSuggestion.knex(), async txn => {
    const patientTaskSuggestion = await PatientTaskSuggestion.get(
      input.patientTaskSuggestionId,
      txn,
    );

    if (patientTaskSuggestion) {
      const { patientId, taskTemplateId } = patientTaskSuggestion;
      if (taskTemplateId) {
        await PatientTaskSuggestion.accept(patientTaskSuggestion.id, userId!, txn);
        const taskTemplate = await TaskTemplate.get(taskTemplateId, txn);
        await createTaskForTaskTemplate(taskTemplate, userId!, patientId, txn);
      }
    }

    return patientTaskSuggestion;
  });
}
