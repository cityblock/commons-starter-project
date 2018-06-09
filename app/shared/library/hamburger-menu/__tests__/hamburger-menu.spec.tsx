import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../hamburger-menu-option/hamburger-menu-option';
import Icon from '../../icon/icon';
import { Divider, HamburgerMenu } from '../hamburger-menu';

describe('Library Hamburger Menu Component', () => {
  const placeholderFn = jest.fn();

  it('renders icon and no options if closed', () => {
    const wrapper = shallow(
      <HamburgerMenu onMenuToggle={placeholderFn} open={false}>
        <HamburgerMenuOption icon="event" onClick={placeholderFn} />
        <HamburgerMenuOption icon="event" onClick={placeholderFn} />
      </HamburgerMenu>,
    );

    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().name).toBe('moreVert');
    expect(wrapper.find(Icon).props().className).toBe('icon');

    expect(wrapper.find('div').length).toBe(1);
    expect(wrapper.find('div').props().className).toBe('container');
    expect(wrapper.find(HamburgerMenuOption).length).toBe(0);
    expect(wrapper.find(Divider).length).toBe(0);
  });

  it('renders icon and options if open', () => {
    const wrapper = shallow(
      <HamburgerMenu onMenuToggle={placeholderFn} open={true}>
        <HamburgerMenuOption icon="event" onClick={placeholderFn} />
        <HamburgerMenuOption icon="moreVert" onClick={placeholderFn} />
      </HamburgerMenu>,
    );

    expect(wrapper.find(Icon).props().className).toBe('icon open');
    expect(wrapper.find(Divider).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).length).toBe(2);

    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(0)
        .props().icon,
    ).toBe('event');
    expect(
      wrapper
        .find(HamburgerMenuOption)
        .at(1)
        .props().icon,
    ).toBe('moreVert');
  });
});
