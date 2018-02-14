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
  { userId, permissions, txn }: IContext,
): Promise<IRootQueryType['concernsForAnswer']> {
  await checkUserPermissions(userId, permissions, 'view', 'concernSuggestion', txn);

  return ConcernSuggestion.getForAnswer(args.answerId, txn);
}

export async function concernSuggestionCreate(
  root: any,
  args: IConcernSuggestOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['concernSuggestionCreate']> {
  await checkUserPermissions(userId, permissions, 'create', 'concernSuggestion', txn);

  return ConcernSuggestion.create(
    {
      answerId: args.input.answerId || undefined,
      screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
      concernId: args.input.concernId,
    },
    txn,
  );
}

export async function concernSuggestionDelete(
  root: any,
  args: IConcernSuggestOptions,
  { userId, permissions, txn }: IContext,
): Promise<IRootMutationType['concernSuggestionDelete']> {
  await checkUserPermissions(userId, permissions, 'delete', 'concernSuggestion', txn);

  return ConcernSuggestion.delete(
    {
      answerId: args.input.answerId || undefined,
      screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
      concernId: args.input.concernId,
    },
    txn,
  );
}
