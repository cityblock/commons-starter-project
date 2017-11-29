import { shallow } from 'enzyme';
import * as React from 'react';
import PrioritySelect from '../../../task/priority-select';
import CreateTaskPriority from '../priority';
import { FieldLabel } from '../shared';

describe('Create Task Modal Priority Component', () => {
  const value = 'low' as any;
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskPriority value={value} onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FieldLabel).length).toBe(1);
    expect(wrapper.find(FieldLabel).props().messageId).toBe('taskCreate.priority');
    expect(wrapper.find(FieldLabel).props().htmlFor).toBe('priority');
  });

  it('renders a priority select component', () => {
    expect(wrapper.find(PrioritySelect).length).toBe(1);
    expect(wrapper.find(PrioritySelect).props().priority).toBe(value);
    expect(wrapper.find(PrioritySelect).props().onPriorityClick).toBe(onChange);
    expect(wrapper.find(PrioritySelect).props().className).toBe('select circle');
  });
});
