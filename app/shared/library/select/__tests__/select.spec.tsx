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

  it('applies large and disabled styles if specified', () => {
    wrapper.setProps({ disabled: true, large: true, className: '' });

    expect(wrapper.find('select').props().className).toBe('select large disabled');
  });
});
