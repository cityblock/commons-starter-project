import { shallow } from 'enzyme';
import React from 'react';
import { currentUserHours } from '../../shared/util/test-data';
import DailyWorkHours from '../daily-work-hours';
import WorkHours from '../work-hours';

describe('Settings Work Hours', () => {
  const wrapper = shallow(<WorkHours currentUserHours={currentUserHours} disabled={false} />);

  it('renders container', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container');
  });

  it('renders daily work hours component for each day of week', () => {
    expect(wrapper.find(DailyWorkHours).length).toBe(7);

    expect(
      wrapper
        .find(DailyWorkHours)
        .at(0)
        .props().weekday,
    ).toBe(1);
    expect(
      wrapper
        .find(DailyWorkHours)
        .at(0)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(DailyWorkHours)
        .at(0)
        .props().userHours,
    ).toEqual([currentUserHours[0]]);

    expect(
      wrapper
        .find(DailyWorkHours)
        .at(6)
        .props().weekday,
    ).toBe(0);
    expect(
      wrapper
        .find(DailyWorkHours)
        .at(6)
        .props().disabled,
    ).toBeFalsy();
    expect(
      wrapper
        .find(DailyWorkHours)
        .at(6)
        .props().userHours,
    ).toEqual([]);
  });

  it('applies disabled styles if specified', () => {
    wrapper.setProps({ disabled: true });

    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container opaque');

    expect(
      wrapper
        .find(DailyWorkHours)
        .at(0)
        .props().disabled,
    ).toBeTruthy();
    expect(
      wrapper
        .find(DailyWorkHours)
        .at(6)
        .props().disabled,
    ).toBeTruthy();
  });
});
