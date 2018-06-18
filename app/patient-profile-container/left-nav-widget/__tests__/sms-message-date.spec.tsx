import { shallow } from 'enzyme';
import React from 'react';
import Text from '../../../shared/library/text/text';
import SmsMessageDate from '../sms-message-date';

describe('SMS Message Date Banner', () => {
  const wrapper = shallow(<SmsMessageDate date="2018-04-13T16:55:38.965Z" />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders two dividers', () => {
    expect(wrapper.find('.divider').length).toBe(2);
  });

  it('renders text with the date', () => {
    expect(wrapper.find(Text).props().size).toBe('small');
    expect(wrapper.find(Text).props().color).toBe('gray');
    expect(wrapper.find(Text).props().text).toBe('Fri, Apr 13, 2018');
  });
});
