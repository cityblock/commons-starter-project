import { shallow } from 'enzyme';
import * as React from 'react';
import {
  carePlanSuggestionWithGoal as suggestion2,
  fullCarePlanSuggestionWithGoal as suggestion,
} from '../../../shared/util/test-data';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestions from '../goal-suggestions';

describe('Care Plan Suggestions Goal Suggestion List', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <GoalSuggestions
      suggestions={[suggestion, suggestion2]}
      onAccept={placeholderFn}
      onDismiss={placeholderFn}
    />,
  );

  it('renders goal suggestions', () => {
    expect(
      wrapper
        .find(GoalSuggestion)
        .at(0)
        .props().suggestion,
    ).toEqual(suggestion);
    expect(
      wrapper
        .find(GoalSuggestion)
        .at(0)
        .props().selectedGoalSuggestionId,
    ).toBeFalsy();

    expect(
      wrapper
        .find(GoalSuggestion)
        .at(1)
        .props().suggestion,
    ).toEqual(suggestion2);
    expect(
      wrapper
        .find(GoalSuggestion)
        .at(1)
        .props().selectedGoalSuggestionId,
    ).toBeFalsy();
  });

  it('selects goal suggestion', () => {
    wrapper.setState({ selectedGoalSuggestionId: suggestion.id });

    expect(
      wrapper
        .find(GoalSuggestion)
        .at(0)
        .props().selectedGoalSuggestionId,
    ).toBe(suggestion.id);
    expect(
      wrapper
        .find(GoalSuggestion)
        .at(1)
        .props().selectedGoalSuggestionId,
    ).toBe(suggestion.id);
  });

  it('deselects goal suggestion after one is accepted or dismissed', () => {
    wrapper.setProps({ suggestions: [suggestion] });

    expect(wrapper.find(GoalSuggestion).props().selectedGoalSuggestionId).toBeFalsy();
  });
});
