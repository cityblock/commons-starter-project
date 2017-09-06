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
  { db, userRole }: IContext,
) {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return await ConcernSuggestion.getForAnswer(args.answerId);
}

export async function concernSuggestionCreate(
  root: any,
  args: IConcernSuggestOptions,
  { db, userRole }: IContext,
): Promise<Concern[]> {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return await ConcernSuggestion.create({
    answerId: args.input.answerId,
    concernId: args.input.concernId,
  });
}

export async function concernSuggestionDelete(
  root: any,
  args: IConcernSuggestOptions,
  { db, userRole }: IContext,
): Promise<Concern[]> {
  await accessControls.isAllowed(userRole, 'view', 'concern');

  return await ConcernSuggestion.delete({
    answerId: args.input.answerId,
    concernId: args.input.concernId,
  });
}
