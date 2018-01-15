import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import DashboardNavigation, { ROUTE_BASE } from '../navigation';
import NavigationItem, { IProps } from '../navigation-item';

describe('Dashboard Navigation', () => {
  const selected = 'new';
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
    expect(wrapper.find(NavigationItem).length).toBe(6);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().selected,
    ).toBe('tasks');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().icon,
    ).toBe('notifications');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('renders navigation item for new to care team', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().selected,
    ).toBe('new');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().isSelected,
    ).toBeTruthy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().icon,
    ).toBe('addCircle');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().iconStyles,
    ).toBe('greenIcon');
  });

  it('renders navigation item for pending MAP suggestions', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().selected,
    ).toBe('suggestions');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().icon,
    ).toBe('playlistAdd');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('renders navigation item for patients with missing info', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().selected,
    ).toBe('demographics');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().icon,
    ).toBe('person');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('renders navigation item for no recent engagement', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().selected,
    ).toBe('engage');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().icon,
    ).toBe('people');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('renders navigation item for out of date MAP', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().selected,
    ).toBe('updateMAP');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().icon,
    ).toBe('assignment');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().iconStyles,
    ).toBe('redIcon');
  });

  it('removes top border on list if tasks selected', () => {
    wrapper.setProps({ selected: 'tasks' });

    expect(wrapper.find('.list').props().className).toBe('list transparentBorder');
  });
});
