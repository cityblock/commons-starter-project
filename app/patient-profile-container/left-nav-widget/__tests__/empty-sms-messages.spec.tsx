import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import SmallText from '../../../shared/library/small-text/small-text';
import EmptySmsMessages from '../empty-sms-messages';

describe('Empty SMS Messages', () => {
  const wrapper = shallow(<EmptySmsMessages />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders inbox icon', () => {
    expect(wrapper.find(Icon).props().name).toBe('inbox');
    expect(wrapper.find(Icon).props().color).toBe('gray');
  });

  it('renders text that no SMS messages present', () => {
    expect(wrapper.find(SmallText).props().messageId).toBe('messages.empty');
    expect(wrapper.find(SmallText).props().size).toBe('large');
    expect(wrapper.find(SmallText).props().color).toBe('lightGray');
  });
});
