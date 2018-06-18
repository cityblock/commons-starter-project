import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../icon/icon';
import TextInput from '../../text-input/text-input';
import SearchInput from '../input';

describe('Library Search Input Component', () => {
  const value = 'Arya and Sansa';
  const placeholderMessageId = 'Enter Favorite Starks';
  const onChange = jest.fn();

  const wrapper = shallow(
    <SearchInput value={value} placeholderMessageId={placeholderMessageId} onChange={onChange} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text input field', () => {
    expect(wrapper.find(TextInput).length).toBe(1);
    expect(wrapper.find(TextInput).props().value).toBe(value);
    expect(wrapper.find(TextInput).props().onChange).toBe(onChange);
    expect(wrapper.find(TextInput).props().placeholderMessageId).toBe(placeholderMessageId);
    expect(wrapper.find(TextInput).props().className).toBe('textInput');
  });

  it('renders icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('search');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });
});
