import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../shared/library/small-text/small-text';
import ContactsHeader from '../contacts-header';

describe('Contacts Header', () => {
  const wrapper = shallow(<ContactsHeader />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text to update contacts', () => {
    expect(wrapper.find(SmallText).props().messageId).toBe('header.contacts');
    expect(wrapper.find(SmallText).props().color).toBe('white');
    expect(wrapper.find(SmallText).props().font).toBe('basetica');
    expect(wrapper.find(SmallText).props().size).toBe('large');
    expect(wrapper.find(SmallText).props().isBold).toBeTruthy();
  });
});
