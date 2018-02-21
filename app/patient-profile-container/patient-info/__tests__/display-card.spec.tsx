import { shallow } from 'enzyme';
import * as React from 'react';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import DisplayCard from '../display-card';
import FlaggableDisplayField from '../flaggable-display-field';

describe('Render Display Card Component', () => {
  const wrapper = shallow(
    <DisplayCard>
      <FlaggableDisplayField labelMessageId="blah" value={'blah'} />
      <FlaggableDisplayField labelMessageId="foo" value={'foo'} />
    </DisplayCard>,
  );

  it('renders display card without options', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).length).toBe(0);
  });

  it('renders all children', () => {
    expect(wrapper.find(FlaggableDisplayField).length).toBe(2);
  });

  it('renders display card with options set', () => {
    const onEditClick = () => true;
    const onDeleteClick = () => false;

    wrapper.setProps({
      onEditClick,
      onDeleteClick,
      className: 'something',
    });

    expect(wrapper.find(HamburgerMenuOption).length).toBe(2);

    const option1 = wrapper
      .find(HamburgerMenuOption)
      .at(0)
      .props();
    expect(option1.messageId).toBe('displayCard.edit');
    expect(option1.icon).toBe('create');
    expect(option1.onClick).toBe(onEditClick);

    const option2 = wrapper
      .find(HamburgerMenuOption)
      .at(1)
      .props();
    expect(option2.messageId).toBe('displayCard.delete');
    expect(option2.icon).toBe('delete');
    expect(option2.onClick).toBe(onDeleteClick);
  });
});
