import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../library/form-label/form-label';
import TextInput from '../../../library/text-input/text-input';
import CreateTaskTitle from '../title';

describe('Create Goal Modal Title Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskTitle value={value} onChange={onChange} />);

  it('renders a form label', () => {
    expect(wrapper.find(FormLabel).length).toBe(1);
    expect(wrapper.find(FormLabel).props().messageId).toBe('goalCreate.title');
    expect(wrapper.find(FormLabel).props().htmlFor).toBe('title');
  });

  it('renders a text input component', () => {
    expect(wrapper.find(TextInput).length).toBe(1);
    expect(wrapper.find(TextInput).props().value).toBe(value);
    expect(wrapper.find(TextInput).props().onChange).toBe(onChange);
    expect(wrapper.find(TextInput).props().id).toBe('title');
    expect(wrapper.find(TextInput).props().name).toBe('title');
    expect(wrapper.find(TextInput).props().placeholderMessageId).toBe(
      'goalCreate.titlePlaceholder',
    );
  });
});
