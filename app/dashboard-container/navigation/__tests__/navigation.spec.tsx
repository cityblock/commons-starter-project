import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { patientList } from '../../../shared/util/test-data';
import ComputedLists from '../computed-lists';
import { DashboardNavigation, ROUTE_BASE } from '../navigation';
import NavigationItem, { IProps } from '../navigation-item';

describe('Dashboard Navigation', () => {
  const selected = 'new';
  const wrapper = shallow(
    <DashboardNavigation
      selected={selected}
      answerId={null}
      loading={false}
      error={null}
      patientLists={[patientList]}
    />,
  );

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
    expect(wrapper.find(NavigationItem).length).toBe(7);
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
  });

  it('renders navigation item for open CBO referrals', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().selected,
    ).toBe('referrals');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().isSelected,
    ).toBeFalsy();
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
    ).toBe('assignmentInd');
  });

  it('renders navigation item for new to care team', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().selected,
    ).toBe('new');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(2)
        .props().isSelected,
    ).toBeTruthy();
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
    ).toBe('addCircle');
  });

  it('renders navigation item for pending MAP suggestions', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(3)
        .props().selected,
    ).toBe('suggestions');
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
    ).toBe('playlistAdd');
  });

  it('renders navigation item for patients with missing info', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(4)
        .props().selected,
    ).toBe('demographics');
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
    ).toBe('infoOutline');
  });

  it('renders navigation item for no recent engagement', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(5)
        .props().selected,
    ).toBe('engage');
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
    ).toBe('syncProblem');
  });

  it('renders navigation item for out of date MAP', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(6)
        .props().selected,
    ).toBe('updateMAP');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(6)
        .props().isSelected,
    ).toBeFalsy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(6)
        .props().routeBase,
    ).toBe(ROUTE_BASE);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(6)
        .props().icon,
    ).toBe('accessAlarms');
  });

  it('renders computed lists component', () => {
    expect(wrapper.find(ComputedLists).length).toBe(1);
    expect(wrapper.find(ComputedLists).props().patientLists).toEqual([patientList]);
    expect(wrapper.find(ComputedLists).props().loading).toBeFalsy();
    expect(wrapper.find(ComputedLists).props().error).toBeNull();
    expect(wrapper.find(ComputedLists).props().routeBase).toBe(ROUTE_BASE);
    expect(wrapper.find(ComputedLists).props().answerId).toBeNull();
  });

  it('removes top border on list if tasks selected', () => {
    wrapper.setProps({ selected: 'tasks' });

    expect(wrapper.find('.list').props().className).toBe('list transparentBorder');
  });

  it('passes selected answer id to computed lists if there is one', () => {
    const answerId = 'followsKingInTheNorth';
    wrapper.setProps({ answerId });

    expect(wrapper.find(ComputedLists).props().answerId).toBe(answerId);
  });
});
