import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import PrioritySelect from '../../../task/priority-select';
import CreateTaskPriority from '../priority';

describe('Create Task Modal Priority Component', () => {
  const value = 'low' as any;
  const onChange = jest.fn();

  const wrapper = shallow(<CreateTaskPriority value={value} onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.priority');
    expect(wrapper.find(FormLabel).props().htmlFor).toBe('priority');
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
  });

  it('renders a priority select component', () => {
    expect(wrapper.find(PrioritySelect).length).toBe(1);
    expect(wrapper.find(PrioritySelect).props().priority).toBe(value);
    expect(wrapper.find(PrioritySelect).props().onPriorityClick).toBe(onChange);
    expect(wrapper.find(PrioritySelect).props().className).toBe('select circle');
  });

  it('makes label black if no value selected', () => {
    wrapper.setProps({ value: '' });
    expect(wrapper.find(FormLabel).props().gray).toBeFalsy();
  });
});
