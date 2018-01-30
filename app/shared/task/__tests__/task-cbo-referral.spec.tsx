import { shallow } from 'enzyme';
import * as React from 'react';
import { CBOReferral } from '../../util/test-data';
import { Divider } from '../task';
import TaskCBODetail from '../task-cbo-detail';
import TaskCBOReferral from '../task-cbo-referral';
import TaskCBOReferralView from '../task-cbo-referral-view';

describe('Task CBO Referral', () => {
  const taskId = 'defeatNightKing';
  const wrapper = shallow(<TaskCBOReferral CBOReferral={CBOReferral} taskId={taskId} />);

  it('renders task CBO detail', () => {
    expect(wrapper.find(TaskCBODetail).length).toBe(1);
    expect(wrapper.find(TaskCBODetail).props().CBOReferral).toEqual(CBOReferral);
  });

  it('renders button to view form', () => {
    expect(wrapper.find(TaskCBOReferralView).length).toBe(1);
    expect(wrapper.find(TaskCBOReferralView).props().taskId).toBe(taskId);
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
  });
});
