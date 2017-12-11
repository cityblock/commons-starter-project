import { Transaction } from 'objection';
import CarePlanSuggestion from '../models/care-plan-suggestion';
import ConcernSuggestion from '../models/concern-suggestion';
import GoalSuggestion from '../models/goal-suggestion';

export const createSuggestions = async (patientId: string, txn: Transaction) => {
  const newConcernSuggestions = await ConcernSuggestion.getNewForPatient(patientId, txn);
  const newGoalSuggestions = await GoalSuggestion.getNewForPatient(patientId, txn);
  const formattedConcernSuggestions = newConcernSuggestions.map(concernSuggestion => ({
    patientId,
    suggestionType: 'concern' as any,
    concernId: concernSuggestion.id,
  }));
  const formattedGoalSuggestions = newGoalSuggestions.map(goalSuggestion => ({
    patientId,
    suggestionType: 'goal' as any,
    goalSuggestionTemplateId: goalSuggestion.id,
  }));

  const suggestions = formattedConcernSuggestions.concat(formattedGoalSuggestions as any);

  if (suggestions.length) {
    await CarePlanSuggestion.createMultiple({ suggestions }, txn);
  }
  return suggestions;
};

export const createSuggestionsForPatientScreeningToolSubmission = async (
  patientId: string,
  patientScreeningToolSubmissionId: string,
  txn?: Transaction,
) => {
  /* tslint:disable:max-line-length */
  const newConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForPatientScreeningToolSubmission(
    patientId,
    patientScreeningToolSubmissionId,
    txn,
  );
  const newGoalSuggestions = await GoalSuggestion.getNewSuggestionsForPatientScreeningToolSubmission(
    patientId,
    patientScreeningToolSubmissionId,
    txn,
  );
  /* tslint:enable:max-line-length */
  const formattedConcernSuggestions = newConcernSuggestions.map(concernSuggestion => ({
    patientId,
    suggestionType: 'concern' as any,
    concernId: concernSuggestion.id,
    patientScreeningToolSubmissionId,
  }));
  const formattedGoalSuggestions = newGoalSuggestions.map(goalSuggestion => ({
    patientId,
    suggestionType: 'goal' as any,
    goalSuggestionTemplateId: goalSuggestion.id,
    patientScreeningToolSubmissionId,
  }));

  const suggestions = formattedConcernSuggestions.concat(formattedGoalSuggestions as any);
  if (suggestions.length) {
    await CarePlanSuggestion.createMultiple({ suggestions }, txn);
  }
  return suggestions;
};
