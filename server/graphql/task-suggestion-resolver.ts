import { ITaskSuggestInput } from 'schema';
import TaskSuggestion from '../models/task-suggestion';
import TaskTemplate from '../models/task-template';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface ITaskSuggestOptions {
  input: ITaskSuggestInput;
}

export async function resolveTaskSuggestionTemplatesForAnswer(
  root: any,
  args: { answerId: string },
  { db, userRole }: IContext,
): Promise<TaskTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'taskSuggestion');

  return await TaskSuggestion.getForAnswer(args.answerId);
}

export async function taskSuggestionCreate(
  root: any,
  args: ITaskSuggestOptions,
  { db, userRole }: IContext,
): Promise<TaskTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'taskSuggestion');

  return await TaskSuggestion.create({
    answerId: args.input.answerId,
    taskTemplateId: args.input.taskTemplateId,
  });
}

export async function taskSuggestionDelete(
  root: any,
  args: ITaskSuggestOptions,
  { db, userRole }: IContext,
): Promise<TaskTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'taskSuggestion');

  return await TaskSuggestion.delete({
    answerId: args.input.answerId,
    taskTemplateId: args.input.taskTemplateId,
  });
}
