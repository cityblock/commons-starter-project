import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import TextArea from '../textarea';

describe('Library TextArea Component', () => {
  const value = 'Eleven';
  const onChange = jest.fn();

  it('renders textarea with correct value and change handler', () => {
    const wrapper = shallow(<TextArea value={value} onChange={onChange} />);

    expect(wrapper.find('textarea').length).toBe(1);
    expect(wrapper.find('textarea').props().value).toBe(value);
    expect(wrapper.find('textarea').props().onChange).toBe(onChange);
    expect(wrapper.find('textarea').props().className).toBe('textarea');
    expect(wrapper.find('textarea').props().id).toBeFalsy();
  });

  it('passes custom styles if included', () => {
    const className = 'eggo';
    const wrapper = shallow(<TextArea value={value} onChange={onChange} className={className} />);

    expect(wrapper.find('textarea').props().className).toBe(`textarea ${className}`);
  });

  it('passes id if included', () => {
    const id = '011';
    const wrapper = shallow(<TextArea value={value} onChange={onChange} id={id} />);

    expect(wrapper.find('textarea').props().id).toBe(id);
  });

  it('renders formatted message with translated placeholder if provided', () => {
    const placeholderMessageId = 'steveHarrington';

    const wrapper = shallow(
      <TextArea value={value} onChange={onChange} placeholderMessageId={placeholderMessageId} />,
    );

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(placeholderMessageId);
  });

  it('passes optional handlers for on blur and on focus', () => {
    const onBlur = jest.fn();
    const onFocus = jest.fn();

    const wrapper = shallow(
      <TextArea value={value} onChange={onChange} onBlur={onBlur} onFocus={onFocus} />,
    );

    expect(wrapper.find('textarea').props().onBlur).toBe(onBlur);
    expect(wrapper.find('textarea').props().onFocus).toBe(onFocus);
  });

  it('disables textarea if specified', () => {
    const wrapper = shallow(<TextArea value={value} onChange={onChange} disabled={true} />);

    expect(wrapper.find('textarea').props().disabled).toBeTruthy();
    expect(wrapper.find('textarea').props().className).toBe('textarea disabled');
  });

  it('applies small styles if specified', () => {
    const wrapper = shallow(<TextArea value={value} onChange={onChange} small={true} />);
    expect(wrapper.find('textarea').props().className).toBe('textarea small');
  });

  it('applies empty styles if disabled and empty', () => {
    const wrapper = shallow(<TextArea value={''} onChange={onChange} disabled={true} />);

    expect(wrapper.find('textarea').props().className).toBe('textarea disabled empty');
  });
});
