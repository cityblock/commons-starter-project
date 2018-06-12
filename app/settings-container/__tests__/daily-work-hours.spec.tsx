import { shallow } from 'enzyme';
import * as React from 'react';
import Text from '../../shared/library/text/text';
import { currentUserHours } from '../../shared/util/test-data';
import DailyWorkHours from '../daily-work-hours';
import DailyWorkHoursDropdown from '../daily-work-hours-dropdown';
import DayOffToggle from '../day-off-toggle';

describe('Settings Work Hours Options', () => {
  const wrapper = shallow(
    <DailyWorkHours
      userHours={[currentUserHours[0]]}
      weekday={1}
      disabled={false}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text for weekday', () => {
    expect(wrapper.find(Text).props().messageId).toBe('settings.weekday1');
    expect(wrapper.find(Text).props().isHeader).toBeTruthy();
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
    expect(wrapper.find(Text).props().className).toBe('label');
  });

  it('renders dropdown to choose daily work hours', () => {
    expect(wrapper.find(DailyWorkHoursDropdown).props().userHours).toEqual([currentUserHours[0]]);
    expect(wrapper.find(DailyWorkHoursDropdown).props().disabled).toBeFalsy();
  });

  it('renders checkbox to toggle day off', () => {
    expect(wrapper.find(DayOffToggle).props().userHours).toEqual([currentUserHours[0]]);
    expect(wrapper.find(DayOffToggle).props().weekday).toBe(1);
    expect(wrapper.find(DayOffToggle).props().disabled).toBeFalsy();
  });

  it('disables inputs if specified', () => {
    wrapper.setProps({ disabled: true });

    expect(wrapper.find(DailyWorkHoursDropdown).props().disabled).toBeTruthy();
    expect(wrapper.find(DayOffToggle).props().disabled).toBeTruthy();
  });
});
