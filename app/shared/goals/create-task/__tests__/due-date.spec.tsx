import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../../library/date-input/date-input';
import FormLabel from '../../../library/form-label/form-label';
import CreateTaskDueDate from '../due-date';

describe('Create Task Modal Due Date Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskDueDate value={value} onChange={onChange} />);

  it('renders a form label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.dueAt');
    expect(wrapper.find(FormLabel).props().htmlFor).toBe('due-date');
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
  });

  it('renders a date input component', () => {
    expect(wrapper.find(DateInput).length).toBe(1);
    expect(wrapper.find(DateInput).props().value).toBe(value);
    expect(wrapper.find(DateInput).props().onChange).toBe(onChange);
    expect(wrapper.find(DateInput).props().id).toBe('due-date');
    expect(wrapper.find(DateInput).props().name).toBe('due-date');
  });
});
