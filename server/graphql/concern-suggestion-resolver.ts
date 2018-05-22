import { transaction } from 'objection';
import { IConcernSuggestInput, IRootMutationType, IRootQueryType } from 'schema';
import ConcernSuggestion from '../models/concern-suggestion';
import checkUserPermissions from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IConcernSuggestOptions {
  input: IConcernSuggestInput;
}

export async function resolveConcernsForAnswer(
  root: any,
  args: { answerId: string },
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootQueryType['concernsForAnswer']> {
  return transaction(testTransaction || ConcernSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'concernSuggestion', txn);

    return ConcernSuggestion.getForAnswer(args.answerId, txn);
  });
}

export async function concernSuggestionCreate(
  root: any,
  args: IConcernSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernSuggestionCreate']> {
  return transaction(testTransaction || ConcernSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'create', 'concernSuggestion', txn);

    return ConcernSuggestion.create(
      {
        answerId: args.input.answerId || undefined,
        screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
        concernId: args.input.concernId,
      },
      txn,
    );
  });
}

export async function concernSuggestionDelete(
  root: any,
  args: IConcernSuggestOptions,
  { userId, permissions, testTransaction }: IContext,
): Promise<IRootMutationType['concernSuggestionDelete']> {
  return transaction(testTransaction || ConcernSuggestion.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'delete', 'concernSuggestion', txn);

    return ConcernSuggestion.delete(
      {
        answerId: args.input.answerId || undefined,
        screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
        concernId: args.input.concernId,
      },
      txn,
    );
  });
}
