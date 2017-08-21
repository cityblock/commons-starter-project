import { IGoalSuggestInput } from 'schema';
import GoalSuggestion from '../models/goal-suggestion';
import GoalSuggestionTemplate from '../models/goal-suggestion-template';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IGoalSuggestOptions {
  input: IGoalSuggestInput;
}

export async function resolveGoalSuggestionTemplatesForAnswer(
  root: any, args: { answerId: string }, { db, userRole }: IContext,
): Promise<GoalSuggestionTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return await GoalSuggestion.getForAnswer(args.answerId);
}

export async function goalSuggestionCreate(
  root: any, args: IGoalSuggestOptions, { db, userRole }: IContext,
): Promise<GoalSuggestionTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return await GoalSuggestion.create({
    answerId: args.input.answerId,
    goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
  });
}

export async function goalSuggestionDelete(
  root: any, args: IGoalSuggestOptions, { db, userRole }: IContext,
): Promise<GoalSuggestionTemplate[]> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestionTemplate');

  return await GoalSuggestion.delete({
    answerId: args.input.answerId,
    goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
  });
}
