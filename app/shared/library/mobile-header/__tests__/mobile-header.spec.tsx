import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../small-text/small-text';
import MobileHeader from '../mobile-header';

describe('Library Mobile Header', () => {
  const wrapper = shallow(<MobileHeader messageId="winterIsComing" />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text to update contacts', () => {
    expect(wrapper.find(SmallText).props().messageId).toBe('winterIsComing');
    expect(wrapper.find(SmallText).props().color).toBe('white');
    expect(wrapper.find(SmallText).props().font).toBe('basetica');
    expect(wrapper.find(SmallText).props().size).toBe('large');
    expect(wrapper.find(SmallText).props().isBold).toBeTruthy();
  });
});
