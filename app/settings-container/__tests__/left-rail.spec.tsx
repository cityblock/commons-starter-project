import { shallow } from 'enzyme';
import * as React from 'react';
import Text from '../../shared/library/text/text';
import { currentUser } from '../../shared/util/test-data';
import AutomatedResponse from '../automated-response';
import { SettingsLeftRail } from '../left-rail';
import StatusToggle from '../status-toggle';

describe('Settings Left Rail', () => {
  const wrapper = shallow(
    <SettingsLeftRail currentUser={currentUser} editCurrentUser={jest.fn()} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders work hours title', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('settings.workHours');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().font,
    ).toBe('baseticaBold');
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
        .props().isHeader,
    ).toBeTruthy();
  });

  it('renders work hours detail', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('settings.workHoursDetail');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('gray');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isHeader,
    ).toBeFalsy();
  });

  it('renders status toggle', () => {
    expect(wrapper.find(StatusToggle).props().isAvailable).toBe(currentUser.isAvailable);
  });

  it('renders automated response edit field', () => {
    expect(wrapper.find(AutomatedResponse).props().awayMessage).toBe(currentUser.awayMessage);
  });
});
