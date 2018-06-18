import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../icon/icon';
import ToggleSwitch from '../toggle-switch';

describe('Library Toggle Switch Component', () => {
  const wrapper = shallow(<ToggleSwitch isOn={true} onClick={jest.fn()} />);

  it('renders background', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('background backgroundOn');
  });

  it('renders toggle', () => {
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('toggle toggleOn');
  });

  it('renders icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('work');
    expect(wrapper.find(Icon).props().color).toBe('darkGray');
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('applies different styles when off', () => {
    wrapper.setProps({ isOn: false });

    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('background');
    expect(
      wrapper
        .find('div')
        .at(1)
        .props().className,
    ).toBe('toggle');
    expect(wrapper.find(Icon).props().name).toBe('beachAccess');
  });
});
