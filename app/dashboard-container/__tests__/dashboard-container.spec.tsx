import { shallow } from 'enzyme';
import * as React from 'react';
import DashboardContainer, { Selected } from '../dashboard-container';
import DashboardNavigation from '../navigation/navigation';

describe('Dashboard Container', () => {
  const tab = 'tasks' as Selected;

  const match = {
    params: {
      tab,
    },
  };

  const wrapper = shallow(<DashboardContainer match={match} />);

  it('renders dashboard navigation', () => {
    expect(wrapper.find(DashboardNavigation).length).toBe(1);
    expect(wrapper.find(DashboardNavigation).props().selected).toBe(tab);
  });
});
