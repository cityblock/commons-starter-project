import { shallow } from 'enzyme';
import * as React from 'react';
import { currentUser, featureFlags } from '../../shared/util/test-data';
import { DashboardContainer, Selected } from '../dashboard-container';
import DashboardPatients, { IProps } from '../dashboard-patients';
import DashboardNavigation from '../navigation/navigation';

describe('Dashboard Container', () => {
  const list = 'tasks' as Selected;

  const match = {
    params: {
      list,
    },
  };

  const wrapper = shallow(
    <DashboardContainer
      match={match}
      currentUser={currentUser}
      featureFlags={featureFlags}
      history={{} as any}
    />,
  );

  it('renders dashboard navigation', () => {
    expect(wrapper.find(DashboardNavigation).length).toBe(1);
    expect(wrapper.find(DashboardNavigation).props().selected).toBe(list);
    expect(wrapper.find(DashboardNavigation).props().answerId).toBeNull();
  });

  it('renders dashboard patients container', () => {
    expect(wrapper.find(DashboardPatients).length).toBe(1);
    expect(wrapper.find<IProps>(DashboardPatients).props().selected).toBe(list);
    expect(wrapper.find<IProps>(DashboardPatients).props().answerId).toBeNull();
  });

  it('passes answer id if there is one', () => {
    const answerId = 'hasBlueEyes';
    wrapper.setProps({ match: { params: { list, answerId } } });

    expect(wrapper.find(DashboardNavigation).props().answerId).toBe(answerId);
    expect(wrapper.find<IProps>(DashboardPatients).props().answerId).toBe(answerId);
  });
});
