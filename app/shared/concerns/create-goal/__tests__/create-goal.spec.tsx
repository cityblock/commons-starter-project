import { shallow } from 'enzyme';
import * as React from 'react';
import { Popup } from '../../../popup/popup';
import { CreateGoalModal } from '../create-goal';
import DefineGoal from '../define-goal';
import SuggestedTasks from '../suggested-tasks';

describe('Create Goal Modal', () => {
  const placeholderFn = () => true as any;
  const patientId = 'janeIves';
  const patientConcernId = '011';
  const id1 = 'janeIves';
  const id2 = 'nancyWheeler';
  const id3 = 'steveHarrington';

  const goalSuggestionTemplateIds = [id2];
  const goalSuggestionTemplates = [
    {
      id: id1,
    },
    {
      id: id2,
    },
    {
      id: id3,
    },
  ] as any;

  const wrapper = shallow(
    <CreateGoalModal
      visible={false}
      patientId={patientId}
      patientConcernId={patientConcernId}
      createPatientGoal={placeholderFn}
      goalSuggestionTemplates={goalSuggestionTemplates}
      loading={false}
      goalSuggestionTemplateIds={goalSuggestionTemplateIds}
      closePopup={placeholderFn}
    />,
  );

  it('renders nothing if not visible', () => {
    expect(wrapper.find(Popup).length).toBe(0);
  });

  it('renders popup component', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('renders component to select goal initially', () => {
    expect(wrapper.find(DefineGoal).length).toBe(1);
    expect(wrapper.find(DefineGoal).props().title).toBeFalsy();

    expect(wrapper.find(SuggestedTasks).length).toBe(0);
  });

  it('passes goal suggestion templates that are not alraedy selected to define goal', () => {
    expect(wrapper.find(DefineGoal).props().goalSuggestionTemplates.length).toBe(2);
    expect(wrapper.find(DefineGoal).props().goalSuggestionTemplates[0].id).toBe(id1);
    expect(wrapper.find(DefineGoal).props().goalSuggestionTemplates[1].id).toBe(id3);
  });

  it('sets the title in define goal component', () => {
    const title = 'Stranger Things 2';
    wrapper.setState({ title });

    expect(wrapper.find(DefineGoal).props().title).toBe(title);
  });

  it('does not show all goals or hide search results initially', () => {
    expect(wrapper.find(DefineGoal).props().showAllGoals).toBeFalsy();
    expect(wrapper.find(DefineGoal).props().hideSearchResults).toBeFalsy();
  });

  it('shows all goals and hide search results', () => {
    wrapper.setState({ showAllGoals: true, hideSearchResults: true });
    expect(wrapper.find(DefineGoal).props().showAllGoals).toBeTruthy();
    expect(wrapper.find(DefineGoal).props().hideSearchResults).toBeTruthy();
  });

  it('renders suggested tasks if view changes', () => {
    wrapper.setState({ suggestedTaskView: true });

    expect(wrapper.find(DefineGoal).length).toBe(0);
    expect(wrapper.find(SuggestedTasks).length).toBe(1);
    expect(wrapper.find(SuggestedTasks).props().rejectedTaskTemplateIds).toEqual([]);
  });

  it('passes rejected task template id', () => {
    const rejectedTaskTemplateIds = 'jonathanByers';
    wrapper.setState({ rejectedTaskTemplateIds });
    expect(wrapper.find(SuggestedTasks).props().rejectedTaskTemplateIds).toEqual(
      rejectedTaskTemplateIds,
    );
  });
});
