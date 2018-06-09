import { shallow } from 'enzyme';
import * as React from 'react';
import CheckboxInput from '../checkbox-input';

describe('Library Checkbox Input Component', () => {
  const value = 'jonSnow';
  const label = 'King in the North';
  const placeholderFn = jest.fn();

  const wrapper = shallow(<CheckboxInput value={value} onChange={placeholderFn} checked={false} />);

  it('renders container', () => {
    expect(wrapper.find('div').props().className).toBe('container');
  });

  it('renders radio input', () => {
    expect(wrapper.find('input').length).toBe(1);
    expect(wrapper.find('input').props().type).toBe('checkbox');
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
    expect(wrapper.find('div').props().className).toBe('container checked');
  });

  it('removes enabled styles if disabled', () => {
    wrapper.setProps({ disabled: true, checked: false });
    expect(wrapper.find('div').props().className).toBe('container disabled');
    expect(wrapper.find('input').props().disabled).toBeTruthy();
  });
});
