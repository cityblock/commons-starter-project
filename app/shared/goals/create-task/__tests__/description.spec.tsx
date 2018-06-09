import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import TextArea from '../../../library/textarea/textarea';
import CreateTaskDescription from '../description';

describe('Create Task Modal Description Component', () => {
  const value = 'Eleven';
  const onChange = jest.fn();

  const wrapper = shallow(
    <CreateTaskDescription value={value} onChange={onChange} taskType="general" />,
  );

  it('renders a field label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.description');
    expect(wrapper.find(FormLabel).props().htmlFor).toBe('description');
  });

  it('renders a TextArea component', () => {
    expect(wrapper.find(TextArea).length).toBe(1);
    expect(wrapper.find(TextArea).props().value).toBe(value);
    expect(wrapper.find(TextArea).props().onChange).toBe(onChange);
    expect(wrapper.find(TextArea).props().id).toBe('description');
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe(
      'taskCreate.descriptionPlaceholder',
    );
  });

  it('changes form label to gray on completion', () => {
    wrapper.setState({ complete: true });
    expect(wrapper.find(FormLabel).props().gray).toBeTruthy();
  });

  it('changes field label if CBO referral task', () => {
    wrapper.setProps({ taskType: 'CBOReferral' });

    expect(wrapper.find(FormLabel).props().messageId).toBe('taskCreate.referralNote');
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('taskCreate.noteDetail');
  });
});
