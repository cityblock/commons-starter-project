import { shallow } from 'enzyme';
import * as React from 'react';
import TextInput from '../text-input';

describe('Library Text Input Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

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
});
