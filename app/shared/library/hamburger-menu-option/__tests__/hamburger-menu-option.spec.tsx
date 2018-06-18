import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../../icon/icon';
import HamburgerMenuOption from '../hamburger-menu-option';

describe('Library Hamburger Menu Option Component', () => {
  const onClick = jest.fn();
  const messageId = 'el';
  const icon = 'event';

  it('renders basic menu option component with translation', () => {
    const wrapper = shallow(<HamburgerMenuOption messageId={messageId} onClick={onClick} />);

    expect(wrapper.find('p').length).toBe(0);
    expect(wrapper.find(Icon).length).toBe(0);
    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('div').props().className).toBe('option center');
    expect(wrapper.find('div').props().onClick).toBe(onClick);

    expect(wrapper.find(FormattedMessage).length).toBe(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe(messageId);
  });

  it('renders menu option component with label', () => {
    const label = 'Eleven';
    const wrapper = shallow(<HamburgerMenuOption label={label} onClick={onClick} />);

    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(label);

    expect(wrapper.find(FormattedMessage).length).toBe(0);
  });

  it('renders menu option with icon', () => {
    const wrapper = shallow(
      <HamburgerMenuOption messageId={messageId} onClick={onClick} icon={icon} />,
    );

    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe(icon);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders menu option with custom styles if given', () => {
    const className = 'custom';
    const iconStyles = 'customIcon';

    const wrapper = shallow(
      <HamburgerMenuOption
        messageId={messageId}
        onClick={onClick}
        icon={icon}
        className={className}
        iconStyles={iconStyles}
      />,
    );

    expect(wrapper.find('div').props().className).toBe(`option ${className}`);
    expect(wrapper.find(Icon).props().className).toBe(`icon ${iconStyles}`);
  });
});
