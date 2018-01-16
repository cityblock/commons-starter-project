import { shallow } from 'enzyme';
import * as React from 'react';
import Select from '../select';

describe('Library Select Component', () => {
  const value = 'Venusaur';
  const onChange = () => true as any;
  const className = 'grassPokemon';

  const wrapper = shallow(<Select value={value} onChange={onChange} className={className} />);

  it('renders a select tag with correct props', () => {
    const select = wrapper.find('select');

    expect(select.length).toBe(1);
    expect(select.props().value).toBe(value);
    expect(select.props().onChange).toBe(onChange);
    expect(select.props().className).toBe(`select ${className}`);
  });

  it('applies gray font styles if no value selected', () => {
    wrapper.setProps({ value: '', className: '' });

    expect(wrapper.find('select').props().className).toBe('select noValue');
  });

  it('applies large and disabled styles if specified', () => {
    wrapper.setProps({ disabled: true, large: true, className: '', value });

    expect(wrapper.find('select').props().className).toBe('select large disabled');
  });

  it('applies empty styles if disasbled and no value', () => {
    wrapper.setProps({ large: false, value: '' });

    expect(wrapper.find('select').props().className).toBe('select noValue disabled empty');
  });
});
