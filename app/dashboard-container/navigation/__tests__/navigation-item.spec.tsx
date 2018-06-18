import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../../../shared/library/icon/icon';
import { Divider, NavigationItem } from '../navigation-item';

describe('Dashboard Navigation Item', () => {
  const name = 'tasks';
  const icon = 'notifications';
  const routeBase = '/nymeria';
  const totalCount = 11;
  const patientResults = {
    totalCount,
  } as any;

  const wrapper = shallow(
    <NavigationItem
      selected={name}
      isSelected={false}
      icon={icon}
      routeBase={routeBase}
      loading={false}
      patientResults={patientResults}
      pageNumber={1}
      pageSize={11}
    />,
  );

  it('renders link to relevant list', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${name}`);
    expect(wrapper.find(Link).props().className).toBe('container');
    expect(wrapper.find(Link).props().onClick).toBeFalsy();
  });

  it('renders formatted text with given name', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(`dashboard.${name}`);
  });

  it('renders specified icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe(icon);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
    expect(wrapper.find(Divider).props().className).toBe('divider grayDivider');
  });

  it('handles styling if selected', () => {
    wrapper.setProps({ isSelected: true });
    expect(wrapper.find(Link).props().className).toBe('container selected');
    expect(wrapper.find(Divider).props().className).toBe('divider');
    expect(wrapper.find(Icon).props().className).toBe('icon selectedIcon');
  });

  it('renders text label if one given', () => {
    const text = "Arya Stark's Direwolf";
    wrapper.setProps({ text });

    expect(wrapper.find(FormattedMessage).length).toBe(0);
    expect(wrapper.find('h4').text()).toBe(text);
  });

  it('renders count of patients in list', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(`${totalCount}`);
  });

  it('does not render count of patient list if patient results not defined yet', () => {
    wrapper.setProps({ patientResults: null });

    expect(wrapper.find('p').length).toBe(0);
  });

  it('links to computed list with correct answer id if one given', () => {
    const answerId = 'loyalToCersei';
    wrapper.setProps({ answerId });

    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${name}/${answerId}`);
  });

  it('disables link if loading placeholder', () => {
    wrapper.setProps({ selected: 'loading', isSelected: false });

    expect(wrapper.find(Link).props().onClick).toBeTruthy();
    expect(wrapper.find(Link).props().className).toBe('container loading');
  });

  describe('Divider', () => {
    const className = 'kingInTheNorth';
    const wrapper2 = shallow(<Divider className={className} />);

    it('renders a div with specified class name', () => {
      expect(wrapper2.find('div').length).toBe(1);
      expect(wrapper2.find('div').props().className).toBe(className);
    });
  });
});
