import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../../library/modal-header/modal-header';
import DefineGoal from '../define-goal';
import GoalSelect, { CUSTOM_GOAL_ID } from '../goal-select';
import CreateGoalTitle from '../title';

describe('Create Goal Modal', () => {
  const placeholderFn = () => true as any;
  const title = '';
  const goalSuggestionTemplateId = '011';

  const wrapper = shallow(
    <DefineGoal
      loading={false}
      title={title}
      goalSuggestionTemplateId={goalSuggestionTemplateId}
      goalSuggestionTemplates={[]}
      closePopup={placeholderFn}
      onSelectChange={placeholderFn}
      onTitleChange={placeholderFn}
      onSubmit={placeholderFn}
    />,
  );

  it('renders modal header component', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('goalCreate.addGoal');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('goalCreate.detail');
  });

  it('renders select tag to choose goal', () => {
    expect(wrapper.find(GoalSelect).length).toBe(1);
    expect(wrapper.find(GoalSelect).props().goalSuggestionTempalteId).toBeFalsy();
  });

  it('changes value of goal select', () => {
    wrapper.setProps({ goalSuggestionTemplateId });
    expect(wrapper.find(GoalSelect).props().goalSuggestionTemplateId).toBe(
      goalSuggestionTemplateId,
    );
  });

  it('does not render custom goal title field initially', () => {
    expect(wrapper.find(CreateGoalTitle).length).toBe(0);
  });

  it('renders custom goal title field if specified', () => {
    wrapper.setProps({ goalSuggestionTemplateId: CUSTOM_GOAL_ID });
    expect(wrapper.find(CreateGoalTitle).length).toBe(1);
    expect(wrapper.find(CreateGoalTitle).props().value).toBeFalsy();
  });

  it('changes the custom goal title', () => {
    const newTitle = 'The Upside Down';
    wrapper.setProps({ title: newTitle });
    expect(wrapper.find(CreateGoalTitle).props().value).toBe(newTitle);
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('goalCreate.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('goalCreate.submit');
  });
});
