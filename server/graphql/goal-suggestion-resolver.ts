import { IGoalSuggestInput, IRootMutationType, IRootQueryType } from 'schema';
import GoalSuggestion from '../models/goal-suggestion';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IGoalSuggestOptions {
  input: IGoalSuggestInput;
}

export async function resolveGoalSuggestionTemplatesForAnswer(
  root: any,
  args: { answerId: string },
  { db, userRole, txn }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplatesForAnswer']> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestion');

  return GoalSuggestion.getForAnswer(args.answerId, txn);
}

export async function goalSuggestionCreate(
  root: any,
  args: IGoalSuggestOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionCreate']> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestion');

  return GoalSuggestion.create(
    {
      answerId: args.input.answerId || undefined,
      screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
      goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
    },
    txn,
  );
}

export async function goalSuggestionDelete(
  root: any,
  args: IGoalSuggestOptions,
  { db, userRole, txn }: IContext,
): Promise<IRootMutationType['goalSuggestionDelete']> {
  await accessControls.isAllowed(userRole, 'view', 'goalSuggestion');

  return GoalSuggestion.delete(
    {
      answerId: args.input.answerId || undefined,
      screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
      goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
    },
    txn,
  );
}
