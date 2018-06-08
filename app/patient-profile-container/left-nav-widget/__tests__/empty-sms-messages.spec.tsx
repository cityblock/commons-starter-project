import { shallow } from 'enzyme';
import * as React from 'react';
import Icon from '../../../shared/library/icon/icon';
import Text from '../../../shared/library/text/text';
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
    expect(wrapper.find(Text).props().messageId).toBe('messages.empty');
    expect(wrapper.find(Text).props().size).toBe('large');
    expect(wrapper.find(Text).props().color).toBe('lightGray');
  });
});
