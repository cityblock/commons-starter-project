import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import { smsMessage1, smsMessage2 } from '../../../shared/util/test-data';
import SmsMessage, { TIME_FORMAT } from '../sms-message';

describe('SMS Message', () => {
  const wrapper = shallow(<SmsMessage smsMessage={smsMessage1} />);

  it('renders container', () => {
    expect(wrapper.find('.container').props().className).toBe('container');
  });

  it('renders content', () => {
    expect(wrapper.find('.content').props().className).toBe('content');
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
    ).toBe('message toUser');
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

  it('applies right alignment on container if outbound', () => {
    wrapper.setProps({ smsMessage: smsMessage2 });

    expect(wrapper.find('.container').props().className).toBe('container alignRight');
  });

  it('applies right alignment on content if outbound', () => {
    expect(wrapper.find('.content').props().className).toBe('content alignRight');
  });

  it('styles message appropriately if outbound', () => {
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(SmallText)
        .at(0)
        .props().className,
    ).toBe('message fromUser');
  });
});
