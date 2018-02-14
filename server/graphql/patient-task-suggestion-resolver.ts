import {
  IPatientTaskSuggestionAcceptInput,
  IPatientTaskSuggestionDismissInput,
  IRootMutationType,
} from 'schema';
import { createTaskForTaskTemplate } from '../lib/create-task-for-task-template';
import PatientTaskSuggestion from '../models/patient-task-suggestion';
import TaskTemplate from '../models/task-template';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

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
  { permissions, userId, txn }: IContext,
): Promise<PatientTaskSuggestion[]> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, args.patientId);

  return PatientTaskSuggestion.getForPatient(args.patientId, txn);
}

export async function patientTaskSuggestionDismiss(
  root: any,
  { input }: IPatientTaskSuggestionDismissArgs,
  { permissions, userId, txn }: IContext,
): Promise<PatientTaskSuggestion | undefined> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    input.patientTaskSuggestionId,
  );

  return PatientTaskSuggestion.dismiss(
    {
      patientTaskSuggestionId: input.patientTaskSuggestionId,
      dismissedById: userId!,
      dismissedReason: input.dismissedReason,
    },
    txn,
  );
}

export async function patientTaskSuggestionAccept(
  root: any,
  { input }: IPatientTaskSuggestionAcceptArgs,
  { permissions, userId, txn }: IContext,
): Promise<IRootMutationType['patientTaskSuggestionAccept']> {
  await checkUserPermissions(
    userId,
    permissions,
    'edit',
    'patient',
    txn,
    input.patientTaskSuggestionId,
  );

  const patientTaskSuggestion = await PatientTaskSuggestion.get(input.patientTaskSuggestionId, txn);

  if (patientTaskSuggestion) {
    const { patientId, taskTemplateId } = patientTaskSuggestion;
    if (taskTemplateId) {
      await PatientTaskSuggestion.accept(patientTaskSuggestion.id, userId!, txn);
      const taskTemplate = await TaskTemplate.get(taskTemplateId, txn);
      await createTaskForTaskTemplate(taskTemplate, userId!, patientId, txn);
    }
  }

  return patientTaskSuggestion || null;
}
