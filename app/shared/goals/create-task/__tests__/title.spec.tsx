import { shallow } from 'enzyme';
import * as React from 'react';
import TextInput from '../../../library/text-input/text-input';
import { FieldLabel } from '../shared';
import CreateTaskTitle from '../title';

describe('Create Task Modal Title Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskTitle value={value} onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FieldLabel).length).toBe(1);
    expect(wrapper.find(FieldLabel).props().messageId).toBe('taskCreate.title');
    expect(wrapper.find(FieldLabel).props().htmlFor).toBe('title');
  });

  it('renders a text input component', () => {
    expect(wrapper.find(TextInput).length).toBe(1);
    expect(wrapper.find(TextInput).props().value).toBe(value);
    expect(wrapper.find(TextInput).props().onChange).toBe(onChange);
    expect(wrapper.find(TextInput).props().id).toBe('title');
    expect(wrapper.find(TextInput).props().name).toBe('title');
  });
});
