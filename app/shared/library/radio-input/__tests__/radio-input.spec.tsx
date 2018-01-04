import { shallow } from 'enzyme';
import * as React from 'react';
import RadioInput from '../radio-input';

describe('Library Radio Input Component', () => {
  const value = 'sansaStark';
  const label = 'Lady of Winterfell';
  const placeholderFn = () => true as any;

  const wrapper = shallow(<RadioInput value={value} onChange={placeholderFn} checked={false} />);

  it('renders container', () => {
    expect(wrapper.find('div').props().className).toBe('container enabled');
  });

  it('renders radio input', () => {
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').props().type).toBe('radio');
    expect(wrapper.find('input').props().id).toBe(value);
    expect(wrapper.find('input').props().value).toBe(value);
    expect(wrapper.find('input').props().checked).toBeFalsy();
    expect(wrapper.find('input').props().disabled).toBeFalsy();
  });

  it('renders label using value if no display label provided', () => {
    expect(wrapper.find('label').length).toBe(1);
    expect(wrapper.find('label').props().htmlFor).toBe(value);
    expect(wrapper.find('label').text()).toBe(value);
  });

  it('renders display label if specified', () => {
    wrapper.setProps({ label });
    expect(wrapper.find('label').text()).toBe(label);
  });

  it('applies checked styles if radio selected', () => {
    wrapper.setProps({ checked: true });
    expect(wrapper.find('div').props().className).toBe('container checked enabled');
  });

  it('removes enabled styles if disabled', () => {
    wrapper.setProps({ disabled: true, checked: false });
    expect(wrapper.find('div').props().className).toBe('container');
  });
});
