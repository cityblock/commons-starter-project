import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import HamburgerMenuOption from '../../../shared/library/hamburger-menu-option/hamburger-menu-option';
import HamburgerMenu from '../../../shared/library/hamburger-menu/hamburger-menu';
import SmallText from '../../../shared/library/small-text/small-text';
import FlaggableDisplayCard, { FooterState } from '../flaggable-display-card';
import FlaggableDisplayField from '../flaggable-display-field';

describe('Render Flaggable Display Card Component', () => {
  const wrapper = shallow(
    <FlaggableDisplayCard
      titleMessageId="some.title"
      footerState={'none' as FooterState}
      onFlagClick={() => true}
    >
      <FlaggableDisplayField labelMessageId="blah" value={'blah'} />
      <FlaggableDisplayField labelMessageId="foo" value={'foo'} />
    </FlaggableDisplayCard>,
  );

  it('renders flaggable display card not in flagged state', () => {
    expect(wrapper.find(HamburgerMenu).length).toBe(1);
    expect(wrapper.find(HamburgerMenuOption).length).toBe(1);
    expect(wrapper.find(SmallText).length).toBe(0);
    expect(wrapper.find(Button).length).toBe(0);
  });

  it('renders all children', () => {
    expect(wrapper.find(FlaggableDisplayField).length).toBe(2);
  });

  it('renders display card with flagged options set', () => {
    wrapper.setProps({
      footerState: 'flagged',
      flaggedMessageId: 'flagged.id',
    });

    expect(wrapper.find(SmallText).length).toBe(1);

    const text = wrapper.find(SmallText).props();
    expect(text.messageId).toBe('flagged.id');
    expect(text.color).toBe('black');
    expect(text.size).toBe('medium');
  });

  it('renders display card with needs confirmation options set', () => {
    const onConfirmClick = () => true;
    wrapper.setProps({
      footerState: 'confirm',
      confirmMessageId: 'confirm.id',
      onConfirmClick,
    });

    expect(wrapper.find(SmallText).length).toBe(1);

    const text = wrapper.find(SmallText).props();
    expect(text.messageId).toBe('confirm.id');
    expect(text.color).toBe('white');
    expect(text.size).toBe('medium');

    expect(wrapper.find(Button).length).toBe(1);

    const button = wrapper.find(Button).props();
    expect(button.messageId).toBe('flaggableDisplayCard.confirm');
    expect(button.onClick).toBe(onConfirmClick);
  });
});
