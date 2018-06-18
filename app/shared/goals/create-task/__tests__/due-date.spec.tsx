import { shallow } from 'enzyme';
import React from 'react';
import DateInput from '../../../library/date-input/date-input';
import FormLabel from '../../../library/form-label/form-label';
import CreateTaskDueDate from '../due-date';

describe('Create Task Modal Due Date Component', () => {
  const value = 'Eleven';
  const onChange = jest.fn();

  const wrapper = shallow(
    <CreateTaskDueDate value={value} onChange={onChange} taskType="general" />,
  );

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
  });

  it('changes field label if CBO referral task', () => {
    wrapper.setProps({ taskType: 'CBOReferral' });

    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.completeReferral');
  });
});
