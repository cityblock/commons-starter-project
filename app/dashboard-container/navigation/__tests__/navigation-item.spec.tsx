import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import Icon from '../../../shared/library/icon/icon';
import NavigationItem, { Divider } from '../navigation-item';

describe('Dashboard Navigation Item', () => {
  const name = 'tasks';
  const selected = 'new';
  const icon = 'notifications';
  const iconStyles = 'houseStark';
  const routeBase = '/nymeria';

  const wrapper = shallow(
    <NavigationItem
      name={name}
      selected={selected}
      icon={icon}
      iconStyles={iconStyles}
      routeBase={routeBase}
    />,
  );

  it('renders link to relevant list', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(`${routeBase}/${name}`);
    expect(wrapper.find(Link).props().className).toBe('container');
  });

  it('renders formatted text with given name', () => {
    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(`dashboard.${name}`);
  });

  it('renders specified icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe(icon);
    expect(wrapper.find(Icon).props().className).toBe(`icon ${iconStyles}`);
  });

  it('renders divider', () => {
    expect(wrapper.find(Divider).length).toBe(1);
    expect(wrapper.find(Divider).props().className).toBe('divider grayDivider');
  });

  it('handles styling if selected', () => {
    wrapper.setProps({ selected: name });
    expect(wrapper.find(Link).props().className).toBe('container selected');
    expect(wrapper.find(Divider).props().className).toBe('divider');
  });

  it('renders text label if one given', () => {
    const text = "Arya Stark's Direwolf";
    wrapper.setProps({ text });

    expect(wrapper.find(FormattedMessage).length).toBe(0);
    expect(wrapper.find('h4').text()).toBe(text);
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
