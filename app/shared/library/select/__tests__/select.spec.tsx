import { shallow } from 'enzyme';
import * as React from 'react';
import Select from '../select';

describe('Library Select Component', () => {
  it('renders a select tag with correct props', () => {
    const value = 'Venusaur';
    const onChange = () => true as any;
    const className = 'another class';

    const wrapper = shallow(<Select value={value} onChange={onChange} className={className} />);

    const select = wrapper.find('select');

    expect(select.length).toBe(1);
    expect(select.props().value).toBe(value);
    expect(select.props().onChange).toBe(onChange);
    expect(select.props().className).toBe(`select ${className}`);
  });
});
