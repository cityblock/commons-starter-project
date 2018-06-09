import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import TextInput from '../text-input';

describe('Library Text Input Component', () => {
  const value = 'Eleven';
  const onChange = jest.fn();

  it('renders input with correct value and change handler', () => {
    const wrapper = shallow(<TextInput value={value} onChange={onChange} />);

    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').props().type).toBe('text');
    expect(wrapper.find('input').props().value).toBe(value);
    expect(wrapper.find('input').props().onChange).toBe(onChange);
    expect(wrapper.find('input').props().className).toBe('input');
    expect(wrapper.find('input').props().name).toBeFalsy();
    expect(wrapper.find('input').props().id).toBeFalsy();
  });

  it('passes custom styles if included', () => {
    const className = 'eggo';
    const wrapper = shallow(<TextInput value={value} onChange={onChange} className={className} />);

    expect(wrapper.find('input').props().className).toBe(`input ${className}`);
  });

  it('passes name and id if included', () => {
    const name = 'Jane Ives';
    const id = '011';
    const wrapper = shallow(<TextInput value={value} onChange={onChange} id={id} name={name} />);

    expect(wrapper.find('input').props().name).toBe(name);
    expect(wrapper.find('input').props().id).toBe(id);
  });

  it('renders formatted message with translated placeholder if provided', () => {
    const placeholderMessageId = 'steveHarrington';

    const wrapper = shallow(
      <TextInput value={value} onChange={onChange} placeholderMessageId={placeholderMessageId} />,
    );

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(placeholderMessageId);
  });

  it('passes optional handlers for on blur and on focus', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    const wrapper = shallow(
      <TextInput value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />,
    );

    expect(wrapper.find('input').props().onBlur).toBe(onBlur);
    expect(wrapper.find('input').props().onFocus).toBe(onFocus);
  });
});
