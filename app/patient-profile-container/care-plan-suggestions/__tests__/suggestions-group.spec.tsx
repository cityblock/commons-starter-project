import { shallow } from 'enzyme';
import React from 'react';
import {
  fullCarePlanSuggestionWithConcern,
  fullCarePlanSuggestionWithGoal,
} from '../../../shared/util/test-data';
import CarePlanSuggestion from '../care-plan-suggestion';
import GoalSuggestions from '../goal-suggestions';
import SuggestionsGroup from '../suggestions-group';

describe('renders care plan suggestions group', () => {
  const onAccept = jest.fn();
  const onDismiss = jest.fn();
  const onClick = jest.fn();
  const title = 'Test Group Title';

  const wrapper = shallow(
    <SuggestionsGroup
      title={title}
      suggestions={[
        fullCarePlanSuggestionWithConcern,
        fullCarePlanSuggestionWithConcern,
        fullCarePlanSuggestionWithGoal,
        fullCarePlanSuggestionWithGoal,
      ]}
      isSelected={false}
      isHidden={false}
      onAccept={onAccept}
      onDismiss={onDismiss}
      onClick={onClick}
    />,
  );

  it('renders unselected unhidden suggestions group', () => {
    expect(wrapper.find('div.title').text()).toBe(title);
    expect(wrapper.find('div.hidden')).toHaveLength(1);

    const concernSuggestion = wrapper.find(CarePlanSuggestion);
    expect(concernSuggestion).toHaveLength(1);
    expect(concernSuggestion.props().suggestion).toBe(fullCarePlanSuggestionWithConcern);
    expect(concernSuggestion.props().onAccept).not.toBe(onAccept);
    expect(concernSuggestion.props().onDismiss).not.toBe(onDismiss);

    const goalSuggestions = wrapper.find(GoalSuggestions);
    expect(goalSuggestions).toHaveLength(1);
    expect(goalSuggestions.props().suggestions).toContain(fullCarePlanSuggestionWithGoal);
    expect(goalSuggestions.props().onAccept).toBe(onAccept);
    expect(goalSuggestions.props().onDismiss).toBe(onDismiss);
  });

  it('renders selected unhidden suggestions group', () => {
    wrapper.setProps({ isSelected: true });
    expect(wrapper.find('div.title').text()).toBe(title);
    expect(wrapper.find('div.hidden')).toHaveLength(0);

    const concernSuggestion = wrapper.find(CarePlanSuggestion);
    expect(concernSuggestion).toHaveLength(1);
    expect(concernSuggestion.props().suggestion).toBe(fullCarePlanSuggestionWithConcern);

    const goalSuggestions = wrapper.find(GoalSuggestions);
    expect(goalSuggestions).toHaveLength(1);
    expect(goalSuggestions.props().suggestions).toContain(fullCarePlanSuggestionWithGoal);
  });

  it('renders unselected hidden suggestions group', () => {
    wrapper.setProps({ isSelected: false, isHidden: true });
    expect(wrapper.find('div.title').text()).toBe(title);
    expect(wrapper.find('div.hidden')).toHaveLength(2);

    const concernSuggestion = wrapper.find(CarePlanSuggestion);
    expect(concernSuggestion).toHaveLength(1);
    expect(concernSuggestion.props().suggestion).toBe(fullCarePlanSuggestionWithConcern);

    const goalSuggestions = wrapper.find(GoalSuggestions);
    expect(goalSuggestions).toHaveLength(1);
    expect(goalSuggestions.props().suggestions).toContain(fullCarePlanSuggestionWithGoal);
  });
});
