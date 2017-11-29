import { shallow } from 'enzyme';
import * as React from 'react';
import TextArea from '../../../library/textarea/textarea';
import CreateTaskDescription from '../description';
import { FieldLabel } from '../shared';

describe('Create Task Modal Description Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  const wrapper = shallow(<CreateTaskDescription value={value} onChange={onChange} />);

  it('renders a field label', () => {
    expect(wrapper.find(FieldLabel).length).toBe(1);
    expect(wrapper.find(FieldLabel).props().messageId).toBe('taskCreate.description');
    expect(wrapper.find(FieldLabel).props().htmlFor).toBe('description');
  });

  it('renders a TextArea component', () => {
    expect(wrapper.find(TextArea).length).toBe(1);
    expect(wrapper.find(TextArea).props().value).toBe(value);
    expect(wrapper.find(TextArea).props().onChange).toBe(onChange);
    expect(wrapper.find(TextArea).props().id).toBe('description');
    expect(wrapper.find(TextArea).props().name).toBe('description');
  });
});
