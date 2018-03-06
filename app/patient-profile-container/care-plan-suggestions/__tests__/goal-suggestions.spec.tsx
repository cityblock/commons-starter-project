import { shallow } from 'enzyme';
import * as React from 'react';
import { fullCarePlanSuggestionWithGoal as suggestion } from '../../../shared/util/test-data';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestions from '../goal-suggestions';

describe('Care Plan Suggestions Goal Suggestion List', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <GoalSuggestions
      suggestions={[suggestion]}
      onAccept={placeholderFn}
      onDismiss={placeholderFn}
    />,
  );

  it('renders goal suggestions', () => {
    expect(wrapper.find(GoalSuggestion).props().suggestion).toEqual(suggestion);
    expect(wrapper.find(GoalSuggestion).props().selectedGoalSuggestionId).toBeFalsy();
  });

  it('selects goal suggestion', () => {
    wrapper.setState({ selectedGoalSuggestionId: suggestion.id });

    expect(wrapper.find(GoalSuggestion).props().selectedGoalSuggestionId).toBeTruthy();
  });
});
