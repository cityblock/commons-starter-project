import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DashboardNavigation, { ROUTE_BASE } from '../navigation';
import NavigationItem from '../navigation-item';

describe('Dashboard Navigation', () => {
  const selected = 'team';
  const wrapper = shallow(<DashboardNavigation selected={selected} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders navigation header', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('dashboard.lists');
  });

  it('renders list of navigation items', () => {
    expect(wrapper.find('.list').length).toBe(1);
  });

  it('renders navigation item for task notifications', () => {
    expect(wrapper.find(NavigationItem).length).toBe(3);
    expect(
      wrapper
        .find(NavigationItem)
        .at(0)
        .props().name,
    ).toBe('tasks');
    expect(
      wrapper
        .find(NavigationItem)
        .at(0)
        .props().selected,
    ).toBe(selected);
    expect(
      wrapper
        .find(NavigationItem)
        .at(0)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(NavigationItem)
        .at(0)
        .props().icon,
    ).toBe('notifications');
    expect(
      wrapper
        .find(NavigationItem)
        .at(0)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('renders navigation item for new to care team', () => {
    expect(
      wrapper
        .find(NavigationItem)
        .at(1)
        .props().name,
    ).toBe('team');
    expect(
      wrapper
        .find(NavigationItem)
        .at(1)
        .props().selected,
    ).toBe(selected);
    expect(
      wrapper
        .find(NavigationItem)
        .at(1)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(NavigationItem)
        .at(1)
        .props().icon,
    ).toBe('addCircle');
    expect(
      wrapper
        .find(NavigationItem)
        .at(1)
        .props().iconStyles,
    ).toBe('greenIcon');
  });

  it('renders navigation item for pending MAP suggestions', () => {
    expect(
      wrapper
        .find(NavigationItem)
        .at(2)
        .props().name,
    ).toBe('suggestions');
    expect(
      wrapper
        .find(NavigationItem)
        .at(2)
        .props().selected,
    ).toBe(selected);
    expect(
      wrapper
        .find(NavigationItem)
        .at(2)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find(NavigationItem)
        .at(2)
        .props().icon,
    ).toBe('playlistAdd');
    expect(
      wrapper
        .find(NavigationItem)
        .at(2)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('removes top border on list if tasks selected', () => {
    wrapper.setProps({ selected: 'tasks' });

    expect(wrapper.find('.list').props().className).toBe('list transparentBorder');
  });
});
