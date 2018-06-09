import { shallow } from 'enzyme';
import * as React from 'react';
import Option from '../../option/option';
import Select from '../select';

describe('Library Select Component', () => {
  const value = 'Venusaur';
  const onChange = jest.fn();
  const className = 'grassPokemon';

  const wrapper = shallow(
    <Select value={value} onChange={onChange} className={className} name="test" />,
  );

  it('renders a select tag with correct props', () => {
    const select = wrapper.find('select');

    expect(select.length).toBe(1);
    expect(select.props().value).toBe(value);
    expect(select.props().onChange).toBe(onChange);
    expect(select.props().className).toBe(`select ${className}`);
    expect(select.props().name).toBe('test');
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

  it('adds in a placeholder', () => {
    wrapper.setProps({ hasPlaceholder: true });

    expect(wrapper.find(Option).length).toBe(1);
    expect(wrapper.find(Option).props().disabled).toBeTruthy();
    expect(wrapper.find(Option).props().messageId).toBe('test.placeholder');
    expect(wrapper.find(Option).props().value).toBeFalsy();
  });

  it('adds in a selectable placeholder', () => {
    wrapper.setProps({ hasPlaceholder: true, isUnselectable: true });

    expect(wrapper.find(Option).length).toBe(1);
    expect(wrapper.find(Option).props().disabled).toBeFalsy();
  });

  it('adds in options', () => {
    wrapper.setProps({ hasPlaceholder: false, options: ['what', 'else'] });

    expect(wrapper.find(Option).length).toBe(2);
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().value,
    ).toBe('what');
    expect(
      wrapper
        .find(Option)
        .at(0)
        .props().messageId,
    ).toBe('test.what');

    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().value,
    ).toBe('else');
    expect(
      wrapper
        .find(Option)
        .at(1)
        .props().messageId,
    ).toBe('test.else');
  });
});
