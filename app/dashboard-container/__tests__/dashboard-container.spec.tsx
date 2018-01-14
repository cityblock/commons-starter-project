import { shallow } from 'enzyme';
import * as React from 'react';
import DashboardContainer, { Selected } from '../dashboard-container';
import DashboardPatients, { IProps } from '../dashboard-patients';
import DashboardNavigation from '../navigation/navigation';

describe('Dashboard Container', () => {
  const list = 'tasks' as Selected;

  const match = {
    params: {
      list,
    },
  };

  const wrapper = shallow(<DashboardContainer match={match} />);

  it('renders dashboard navigation', () => {
    expect(wrapper.find(DashboardNavigation).length).toBe(1);
    expect(wrapper.find(DashboardNavigation).props().selected).toBe(list);
  });

  it('renders dashboard patients container', () => {
    expect(wrapper.find(DashboardPatients).length).toBe(1);
    expect(wrapper.find<IProps>(DashboardPatients).props().selected).toBe(list);
  });
});
