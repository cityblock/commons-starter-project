import { shallow } from 'enzyme';
import React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
import { QuickActionColorsMapping, QuickActionIconsMapping } from '../helpers';
import LeftNavQuickAction from '../left-nav-quick-action';

describe('Patient Left Navigation Quick Action Button', () => {
  const quickAction = 'addQuickCall';
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <LeftNavQuickAction
      quickAction={quickAction}
      onClick={placeholderFn}
      onClose={placeholderFn}
    />,
  );

  it('renders button', () => {
    expect(wrapper.find('button').props().className).toBe('button');
  });

  it('renders relevant icon', () => {
    expect(wrapper.find(Icon).props().name).toBe(QuickActionIconsMapping[quickAction]);
    expect(wrapper.find(Icon).props().color).toBe(QuickActionColorsMapping[quickAction]);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders text associated with quick action', () => {
    expect(wrapper.find(Text).props().messageId).toBe(`quickActions.${quickAction}`);
    expect(wrapper.find(Text).props().size).toBe('large');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
  });

  it('renders divider', () => {
    expect(wrapper.find('.divider').length).toBe(1);
  });
});
