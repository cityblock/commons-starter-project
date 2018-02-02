import { shallow } from 'enzyme';
import * as React from 'react';
import { patientList, patientList2 } from '../../../shared/util/test-data';
import ComputedLists from '../computed-lists';
import NavigationItem, { IProps } from '../navigation-item';

describe('Dashboard Navigation - Computed Lists', () => {
  const routeBase = '/beyond/the/wall';
  const wrapper = shallow(
    <ComputedLists
      patientLists={[patientList, patientList2]}
      loading={false}
      error={null}
      routeBase={routeBase}
      answerId={null}
    />,
  );

  it('renders navigation item for first patient list', () => {
    expect(wrapper.find(NavigationItem).length).toBe(2);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().text,
    ).toBe(patientList.title);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().routeBase,
    ).toBe(routeBase);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().answerId,
    ).toBe(patientList.answerId);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().selected,
    ).toBe('computed');
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
        .props().icon,
    ).toBe('labelOutline');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().noDivider,
    ).toBeFalsy();
  });

  it('renders navigation item for second patient list', () => {
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().text,
    ).toBe(patientList2.title);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().routeBase,
    ).toBe(routeBase);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().answerId,
    ).toBe(patientList2.answerId);
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().selected,
    ).toBe('computed');
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
        .props().icon,
    ).toBe('labelOutline');
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().noDivider,
    ).toBeTruthy();
  });

  it('selects second item', () => {
    wrapper.setProps({ answerId: patientList2.answerId });

    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(0)
        .props().noDivider,
    ).toBeTruthy();
    expect(
      wrapper
        .find<IProps>(NavigationItem)
        .at(1)
        .props().isSelected,
    ).toBeTruthy();
  });

  it('renders loading placeholder if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(NavigationItem).length).toBe(1);
    expect(wrapper.find<IProps>(NavigationItem).props().selected).toBe('loading');
    expect(wrapper.find<IProps>(NavigationItem).props().isSelected).toBeFalsy();
    expect(wrapper.find<IProps>(NavigationItem).props().icon).toBe('rotateRight');
    expect(wrapper.find<IProps>(NavigationItem).props().noDivider).toBeTruthy();
  });
});
