import { shallow } from 'enzyme';
import * as React from 'react';
import { fullCarePlanSuggestionWithGoal as suggestion } from '../../../shared/util/test-data';
import CarePlanSuggestion from '../care-plan-suggestion';
import GoalSuggestion from '../goal-suggestion';
import TaskTemplate from '../task-template';

describe('Care Plan Suggestion Goal Suggestion Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <GoalSuggestion
      suggestion={suggestion}
      onAccept={placeholderFn}
      onDismiss={placeholderFn}
      selectedGoalSuggestionId=""
      toggleSelectedGoalSuggestionId={placeholderFn}
    />,
  );

  it('renders container', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container');
  });

  it('renders care plan suggestion', () => {
    expect(wrapper.find(CarePlanSuggestion).props().suggestion).toEqual(suggestion);
  });

  it('does not render task templates by default', () => {
    expect(wrapper.find(TaskTemplate).length).toBe(0);
  });

  it('renders task template if selected', () => {
    wrapper.setProps({ selectedGoalSuggestionId: suggestion.id });

    expect(wrapper.find(TaskTemplate).props().taskTemplate).toEqual(
      suggestion.goalSuggestionTemplate.taskTemplates[0],
    );
    expect(wrapper.find(TaskTemplate).props().selected).toBeTruthy();
  });

  it('de-selects task template', () => {
    wrapper.setState({ taskTemplateIds: [] });

    expect(wrapper.find(TaskTemplate).props().selected).toBeFalsy();
  });

  it('applies box shadow if selected', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container shadow');
  });

  it('makes the suggestion opaque and hides tasks if another suggestion selected', () => {
    wrapper.setProps({ selectedGoalSuggestionId: 'greyWind' });

    expect(wrapper.find(TaskTemplate).length).toBe(0);
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container opaque');
  });
});
