import { ICarePlanSuggestions } from 'schema';
import ConcernSuggestion from '../models/concern-suggestion';
import GoalSuggestion from '../models/goal-suggestion';
import accessControls from './shared/access-controls';
import { IContext } from './shared/utils';

export interface IResolveCarePlanSuggestionsOptions {
  patientId: string;
  riskAreaId?: string;
}

export async function resolveCarePlanSuggestionsForPatient(
  root: any, args: IResolveCarePlanSuggestionsOptions, { db, userRole }: IContext,
): Promise<ICarePlanSuggestions> {
  await accessControls.isAllowed(userRole, 'view', 'patient');

  const concernSuggestions = await ConcernSuggestion.getForPatient(args.patientId, args.riskAreaId);
  const goalSuggestions = await GoalSuggestion.getForPatient(args.patientId, args.riskAreaId);

  return {
    concernSuggestions,
    goalSuggestions,
  } as ICarePlanSuggestions;
}
