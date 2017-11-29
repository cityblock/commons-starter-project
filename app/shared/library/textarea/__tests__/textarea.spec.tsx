import { shallow } from 'enzyme';
import * as React from 'react';
import TextArea from '../textarea';

describe('Library TextArea Component', () => {
  const value = 'Eleven';
  const onChange = () => true as any;

  it('renders textarea with correct value and change handler', () => {
    const wrapper = shallow(<TextArea value={value} onChange={onChange} />);

    expect(wrapper.find('textarea').length).toBe(1);
    expect(wrapper.find('textarea').props().value).toBe(value);
    expect(wrapper.find('textarea').props().onChange).toBe(onChange);
    expect(wrapper.find('textarea').props().className).toBe('textarea');
    expect(wrapper.find('textarea').props().name).toBeFalsy();
    expect(wrapper.find('textarea').props().id).toBeFalsy();
  });

  it('passes custom styles if included', () => {
    const className = 'eggo';
    const wrapper = shallow(<TextArea value={value} onChange={onChange} className={className} />);

    expect(wrapper.find('textarea').props().className).toBe(`textarea ${className}`);
  });

  it('passes name and id if included', () => {
    const name = 'Jane Ives';
    const id = '011';
    const wrapper = shallow(<TextArea value={value} onChange={onChange} id={id} name={name} />);

    expect(wrapper.find('textarea').props().name).toBe(name);
    expect(wrapper.find('textarea').props().id).toBe(id);
  });
});
