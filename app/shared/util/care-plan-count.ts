import { FullCarePlanSuggestion } from '../../graphql/types';

export function getConcernCount(carePlanSuggestions: FullCarePlanSuggestion[]) {
  if (!carePlanSuggestions.length) {
    return 0;
  }

  const concernSuggestions = carePlanSuggestions.filter(
    suggestion => suggestion.suggestionType === 'concern',
  );

  return concernSuggestions.length;
}

export function getGoalSuggestions(carePlanSuggestions: FullCarePlanSuggestion[]) {
  if (!carePlanSuggestions.length) {
    return [];
  }

  return carePlanSuggestions.filter(suggestion => suggestion.suggestionType === 'goal');
}

export function getGoalCount(carePlanSuggestions: FullCarePlanSuggestion[]) {
  return getGoalSuggestions(carePlanSuggestions).length;
}

export function getTaskCount(carePlanSuggestions: FullCarePlanSuggestion[]) {
  if (getGoalCount(carePlanSuggestions) === 0) {
    return 0;
  }

  const goalSuggestions = getGoalSuggestions(carePlanSuggestions);

  const taskSuggestions = goalSuggestions
    .map(goalSuggestion => goalSuggestion.goalSuggestionTemplate!.taskTemplates)
    .reduce((taskSuggestions1, taskSuggestions2) => taskSuggestions1.concat(taskSuggestions2));

  return (taskSuggestions || []).length;
}
