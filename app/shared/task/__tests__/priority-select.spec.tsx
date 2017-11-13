import { shallow } from 'enzyme';
import * as React from 'react';
import PrioritySelect, { Option } from '../priority-select';

describe('Task Priority Select Component', () => {
  const taskId = 'taylorSwift';
  const priority = 'high';
  const editTask = () => true as any;

  const wrapper = shallow(
    <PrioritySelect taskId={taskId} priority={priority} editTask={editTask} />,
  );

  it('renders select tag with correct value', () => {
    expect(wrapper.find('select').length).toBe(1);
    expect(wrapper.find('select').props().value).toBe(priority);
  });

  it('renders three options for each priority level', () => {
    expect(wrapper.find(Option).length).toBe(3);

    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBe('low');
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('medium');
    expect(
      wrapper
        .find(Option)
        .at(2)
        .props().value,
    ).toBe('high');
  });
});
