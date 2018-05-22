import { transaction } from 'objection';
import { IGoalSuggestInput, IRootMutationType, IRootQueryType } from 'schema';
import GoalSuggestion from '../models/goal-suggestion';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IGoalSuggestOptions {
  input: IGoalSuggestInput;
}

export async function resolveGoalSuggestionTemplatesForAnswer(
  root: any,
  args: { answerId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['goalSuggestionTemplatesForAnswer']> {
  return transaction(testTransaction || GoalSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'goalSuggestion', txn);

    return GoalSuggestion.getForAnswer(args.answerId, txn);
  });
}

export async function goalSuggestionCreate(
  root: any,
  args: IGoalSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['goalSuggestionCreate']> {
  return transaction(testTransaction || GoalSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'goalSuggestion', txn);

    return GoalSuggestion.create(
      {
        answerId: args.input.answerId || undefined,
        screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
        goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
      },
      txn,
    );
  });
}

export async function goalSuggestionDelete(
  root: any,
  args: IGoalSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['goalSuggestionDelete']> {
  return transaction(testTransaction || GoalSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'goalSuggestion', txn);

    return GoalSuggestion.delete(
      {
        answerId: args.input.answerId || undefined,
        screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
        goalSuggestionTemplateId: args.input.goalSuggestionTemplateId,
      },
      txn,
    );
  });
}
