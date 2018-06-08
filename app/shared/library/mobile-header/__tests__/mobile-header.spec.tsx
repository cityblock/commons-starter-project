import { shallow } from 'enzyme';
import * as React from 'react';
import Text from '../../text/text';
import MobileHeader from '../mobile-header';

describe('Library Mobile Header', () => {
  const wrapper = shallow(<MobileHeader messageId="winterIsComing" />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text to update contacts', () => {
    expect(wrapper.find(Text).props().messageId).toBe('winterIsComing');
    expect(wrapper.find(Text).props().color).toBe('white');
    expect(wrapper.find(Text).props().font).toBe('basetica');
    expect(wrapper.find(Text).props().size).toBe('large');
    expect(wrapper.find(Text).props().isBold).toBeTruthy();
  });
});
