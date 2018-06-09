import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, smsMessage1, smsMessage2 } from '../../../shared/util/test-data';
import { LeftNavMessages } from '../left-nav-messages';
import SmsMessageCreate from '../sms-message-create';
import SmsMessages from '../sms-messages';

describe('Left Nav Messages', () => {
  const patientId = 'sansaStark';
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
      patientId={patientId}
      patient={patient}
      smsMessages={smsMessages}
      messagesError={null}
      messagesLoading={false}
      subscribeToMore={jest.fn()}
    />,
  );

  it('renders list of SMS messages', () => {
    expect(wrapper.find(SmsMessages).props().loading).toBeFalsy();
    expect(wrapper.find(SmsMessages).props().error).toBeNull();
    expect(wrapper.find(SmsMessages).props().smsMessages).toEqual(smsMessages);
  });

  it('renders form to send SMS', () => {
    expect(wrapper.find(SmsMessageCreate).props().patient).toBe(patient);
    expect(wrapper.find(SmsMessageCreate).props().loading).toBeFalsy();
    expect(wrapper.find(SmsMessageCreate).props().error).toBeNull();
  });
});
