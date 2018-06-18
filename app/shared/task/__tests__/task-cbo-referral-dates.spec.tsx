import { shallow } from 'enzyme';
import React from 'react';
import { CBOReferral } from '../../util/test-data';
import TaskCBOReferralDate from '../task-cbo-referral-date';
import TaskCBOReferralDates from '../task-cbo-referral-dates';

describe('Task CBO referral dates component', () => {
  const taskId = 'defeatDemogorgon';

  const wrapper = shallow(<TaskCBOReferralDates CBOReferral={CBOReferral} taskId={taskId} />);

  it('renders field for fax sent at', () => {
    expect(wrapper.find(TaskCBOReferralDate).length).toBe(2);

    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(0)
        .props().field,
    ).toBe('sentAt');
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(0)
        .props().value,
    ).toBe(CBOReferral.sentAt);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(0)
        .props().taskId,
    ).toBe(taskId);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(0)
        .props().CBOReferralId,
    ).toBe(CBOReferral.id);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(0)
        .props().topMargin,
    ).toBeFalsy();
  });

  it('renders field for fax sent at', () => {
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(1)
        .props().field,
    ).toBe('acknowledgedAt');
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(1)
        .props().value,
    ).toBe(CBOReferral.acknowledgedAt);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(1)
        .props().taskId,
    ).toBe(taskId);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(1)
        .props().CBOReferralId,
    ).toBe(CBOReferral.id);
    expect(
      wrapper
        .find(TaskCBOReferralDate)
        .at(1)
        .props().topMargin,
    ).toBeTruthy();
  });
});
