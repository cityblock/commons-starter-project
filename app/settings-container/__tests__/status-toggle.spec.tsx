import { shallow } from 'enzyme';
import * as React from 'react';
import Text from '../../shared/library/text/text';
import ToggleSwitch from '../../shared/library/toggle-switch/toggle-switch';
import StatusToggle from '../status-toggle';

describe('Settings Status Toggle', () => {
  const wrapper = shallow(<StatusToggle isAvailable={true} editCurrentUser={jest.fn()} />);

  it('renders status label', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('settings.status');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().size,
    ).toBe('largest');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().font,
    ).toBe('basetica');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders available if available', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('settings.available');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('largest');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('green');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().font,
    ).toBe('basetica');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders toggle switch', () => {
    expect(wrapper.find(ToggleSwitch).props().isOn).toBeTruthy();
  });

  it('handles unavailable case', () => {
    wrapper.setProps({ isAvailable: false });

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('settings.unavailable');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('red');

    expect(wrapper.find(ToggleSwitch).props().isOn).toBeFalsy();
  });
});
