import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import OptGroup from '../../../library/optgroup/optgroup';
import Option from '../../../library/option/option';
import Select from '../../../library/select/select';
import GoalSelect, { CUSTOM_GOAL_ID } from '../goal-select';

describe('Create Goal Modal Goal Select Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <GoalSelect
      goalSuggestionTemplateId=""
      goalSuggestionTemplates={[]}
      onSelectChange={placeholderFn}
      loading={false}
    />,
  );

  it('renders a label to add a goal', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('goalCreate.selectLabel');
  });

  it('renders select tag with option to select goal', () => {
    expect(wrapper.find(Select).length).toBe(1);
    expect(wrapper.find(Select).props().value).toBeFalsy();
    expect(wrapper.find(Select).props().className).toBe('select');
  });

  it('renders placeholder option to select goal', () => {
    expect(wrapper.find(Option).length).toBe(2);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('goalCreate.selectGoal');
  });

  it('renders option to write own goal', () => {
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe(CUSTOM_GOAL_ID);
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().messageId,
    ).toBe('goalCreate.custom');
  });

  it('renders placeholder option to label templates', () => {
    expect(wrapper.find(OptGroup).length).toBe(1);
    expect(wrapper.find(OptGroup).props().messageId).toBe('goalCreate.templates');
  });

  it('renders goal options', () => {
    const id1 = 'dart';
    const id2 = 'steve';
    const title1 = 'Demogorgon';
    const title2 = 'Snow Ball';

    const goal1 = {
      id: id1,
      title: title1,
    };
    const goal2 = {
      id: id2,
      title: title2,
    };

    const goals = [goal1, goal2] as any;
    wrapper.setProps({ goalSuggestionTemplates: goals });

    expect(wrapper.find(Option).length).toBe(4);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe(id1);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().label,
    ).toBe(title1);
    expect(
      wrapper
        .find(Option)
        .at(3)
        .props().value,
    ).toBe(id2);
    expect(
      wrapper
        .find(Option)
        .at(3)
        .props().label,
    ).toBe(title2);
  });

  it('renders loading option if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Option).length).toBe(3);
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBeFalsy();
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().messageId,
    ).toBe('goalCreate.loading');
  });
});
