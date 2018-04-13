import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import { smsMessage1 } from '../../../shared/util/test-data';
import SmsMessage, { TIME_FORMAT } from '../sms-message';

describe('SMS Message', () => {
  const wrapper = shallow(<SmsMessage smsMessage={smsMessage1} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders flex container', () => {
    expect(wrapper.find('.flex').length).toBe(1);
  });

  it('renders SMS message body', () => {
    expect(wrapper.find(SmallText).length).toBe(2);

    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('blue');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().className,
    ).toBe('message');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().text,
    ).toBe(smsMessage1.body);
  });

  it('renders timestamp', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().color,
    ).toBe('lightGray');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().className,
    ).toBe('timestamp');
    expect(
      wrapper
        .find(SmallText)
        .at(1)
        .props().text,
    ).toBe(format(smsMessage1.createdAt, TIME_FORMAT));
  });
});
