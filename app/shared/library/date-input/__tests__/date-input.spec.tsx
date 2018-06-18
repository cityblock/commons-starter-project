import { format } from 'date-fns';
import { shallow } from 'enzyme';
import React from 'react';
import DateInput, { DEFAULT_FORMAT } from '../date-input';

describe('Library Date Input Component', () => {
  const value = '2017-11-07T13:45:14.532Z';
  const placeholderFn = jest.fn();

  const wrapper = shallow(<DateInput value={value} onChange={placeholderFn} />);

  it('renders date input', () => {
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').props().type).toBe('date');
    expect(wrapper.find('input').props().value).toBe(format(value, DEFAULT_FORMAT));
    expect(wrapper.find('input').props().className).toBe('dateInput');
  });

  it('applies empty styles if value is null', () => {
    wrapper.setProps({ value: null });
    expect(wrapper.find('input').props().className).toBe('dateInput empty');
  });

  it('applies custom styles if specified', () => {
    const className = 'blueEyesWhiteDragon';
    wrapper.setProps({ value, className });

    expect(wrapper.find('input').props().className).toBe(`dateInput ${className}`);
  });

  it('applies small styles if specified', () => {
    wrapper.setProps({ className: '', small: true });
    expect(wrapper.find('input').props().className).toBe('dateInput small');
  });

  it('applies error styles if error occurred', () => {
    wrapper.setProps({ small: false });
    wrapper.setState({ error: 'WALL CAME DOWN!' });

    expect(wrapper.find('input').props().className).toBe('dateInput error');
  });
});
