import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import { smsMessage1, smsMessage2 } from '../../../shared/util/test-data';
import EmptySmsMessages from '../empty-sms-messages';
import { LeftNavMessages } from '../left-nav-messages';
import SmsMessage from '../sms-message';
import SmsMessageDate from '../sms-message-date';

describe('Left Nav Messages', () => {
  const smsMessages = {
    edges: [
      {
        node: smsMessage2,
      },
      {
        node: smsMessage1,
      },
    ],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
    totalCount: 2,
  };

  const wrapper = shallow(
    <LeftNavMessages
      patientId="sansaStark"
      smsMessages={smsMessages}
      subscribeToMore={() => true as any}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders SMS messages', () => {
    expect(wrapper.find(SmsMessage).length).toBe(2);

    expect(
      wrapper
        .find(SmsMessage)
        .at(0)
        .props().smsMessage,
    ).toBe(smsMessage2);
    expect(
      wrapper
        .find(SmsMessage)
        .at(1)
        .props().smsMessage,
    ).toBe(smsMessage1);
  });

  it('renders dates banners when relevant for SMS messages', () => {
    expect(wrapper.find(SmsMessageDate).length).toBe(2);

    expect(
      wrapper
        .find(SmsMessageDate)
        .at(0)
        .props().date,
    ).toBe(smsMessage2.createdAt);
    expect(
      wrapper
        .find(SmsMessageDate)
        .at(1)
        .props().date,
    ).toBe(smsMessage1.createdAt);
  });

  it('renders empty placeholder if no SMS messages', () => {
    const newSmsMessages = {
      edges: [],
      pageInfo: {
        hasPreviousPage: false,
        hasNextPage: false,
      },
      totalCount: 0,
    };

    wrapper.setProps({ smsMessages: newSmsMessages });

    expect(wrapper.find(EmptySmsMessages).length).toBe(1);
    expect(wrapper.find(SmsMessage).length).toBe(0);
    expect(wrapper.find(SmsMessage).length).toBe(0);
  });

  it('renders spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(SmsMessage).length).toBe(0);
    expect(wrapper.find(SmsMessage).length).toBe(0);
  });
});
