import { Transaction } from 'objection';
import CarePlanSuggestion, {
  ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission,
  ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission,
} from '../models/care-plan-suggestion';
import ConcernSuggestion from '../models/concern-suggestion';
import GoalSuggestion from '../models/goal-suggestion';

export const createSuggestionsForRiskAreaAssessmentSubmission = async (
  patientId: string,
  riskAreaAssessmentSubmissionId: string,
  txn?: Transaction,
) => {
  /* tslint:disable:max-line-length */
  const newConcernSuggestions = await ConcernSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
    patientId,
    riskAreaAssessmentSubmissionId,
    txn,
  );
  const newGoalSuggestions = await GoalSuggestion.getNewSuggestionsForRiskAreaAssessmentSubmission(
    patientId,
    riskAreaAssessmentSubmissionId,
    txn,
  );
  /* tslint:enable:max-line-length */
  const formattedConcernSuggestions = newConcernSuggestions.map(
    concernSuggestion =>
      ({
        patientId,
        suggestionType: 'concern' as any,
        concernId: concernSuggestion.id,
        riskAreaAssessmentSubmissionId,
        type: 'riskAreaAssessmentSubmission',
      } as ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission),
  );
  const formattedGoalSuggestions = newGoalSuggestions.map(
    goalSuggestion =>
      ({
        patientId,
        suggestionType: 'goal' as any,
        goalSuggestionTemplateId: goalSuggestion.id,
        riskAreaAssessmentSubmissionId,
        type: 'riskAreaAssessmentSubmission',
      } as ICarePlanSuggestionCreateArgsForRiskAreaAssessmentSubmission),
  );

  const suggestions = formattedConcernSuggestions.concat(formattedGoalSuggestions);
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
  const type = 'patientScreeningToolSubmission';
  /* tslint:enable:max-line-length */
  const formattedConcernSuggestions = newConcernSuggestions.map(
    concernSuggestion =>
      ({
        patientId,
        suggestionType: 'concern' as any,
        concernId: concernSuggestion.id,
        patientScreeningToolSubmissionId,
        type,
      } as ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission),
  );
  const formattedGoalSuggestions = newGoalSuggestions.map(
    goalSuggestion =>
      ({
        patientId,
        suggestionType: 'goal' as any,
        goalSuggestionTemplateId: goalSuggestion.id,
        patientScreeningToolSubmissionId,
        type,
      } as ICarePlanSuggestionCreateArgsForPatientScreeningToolSubmission),
  );

  const suggestions = formattedConcernSuggestions.concat(formattedGoalSuggestions);
  if (suggestions.length) {
    await CarePlanSuggestion.createMultiple({ suggestions }, txn);
  }
  return suggestions;
};
