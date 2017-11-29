import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../../library/date-input/date-input';
import CreateTaskDueDate from '../due-date';
import { FieldLabel } from '../shared';

describe('Create Task Modal Due Date Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskDueDate value={value} onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FieldLabel).length).toBe(1);
    expect(wrapper.find(FieldLabel).props().messageId).toBe('taskCreate.dueAt');
    expect(wrapper.find(FieldLabel).props().htmlFor).toBe('due-date');
  });

  it('renders a date input component', () => {
    expect(wrapper.find(DateInput).length).toBe(1);
    expect(wrapper.find(DateInput).props().value).toBe(value);
    expect(wrapper.find(DateInput).props().onChange).toBe(onChange);
    expect(wrapper.find(DateInput).props().displayText).toBe('Invalid Date');
    expect(wrapper.find(DateInput).props().id).toBe('due-date');
    expect(wrapper.find(DateInput).props().name).toBe('due-date');
  });
});
