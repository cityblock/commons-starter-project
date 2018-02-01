import { IConcernSuggestInput } from 'schema';
import Concern from '../models/concern';
import ConcernSuggestion from '../models/concern-suggestion';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IConcernSuggestOptions {
  input: IConcernSuggestInput;
}

export async function resolveConcernsForAnswer(
  root: any,
  args: { answerId: string },
  { db, userRole, txn }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return ConcernSuggestion.getForAnswer(args.answerId, txn);
}

export async function concernSuggestionCreate(
  root: any,
  args: IConcernSuggestOptions,
  { db, userRole, txn }: IContext,
): Promise<Concern[]> {
  await accessControls.isAllowed(userRole, 'view', 'concern');

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
  { db, userRole, txn }: IContext,
): Promise<Concern[]> {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return ConcernSuggestion.delete(
    {
      answerId: args.input.answerId || undefined,
      screeningToolScoreRangeId: args.input.screeningToolScoreRangeId || undefined,
      concernId: args.input.concernId,
    },
    txn,
  );
}
