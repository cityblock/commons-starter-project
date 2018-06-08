import { format } from 'date-fns';
import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedRelative } from 'react-intl';
import Text from '../../../shared/library/text/text';
import { smsMessage1 } from '../../../shared/util/test-data';
import { PatientLatestSmsMessage, TIMESTAMP_FORMAT } from '../patient-latest-sms-message';

describe('Patient Latest SMS Message', () => {
  const wrapper = shallow(
    <PatientLatestSmsMessage
      loading={false}
      error={null}
      patientId="khalDrogo"
      smsMessage={smsMessage1}
    />,
  );

  const newMessage = {
    ...smsMessage1,
    body: "Lannister, Targaryen, Baratheon, Stark, Tyrell... they're all just spokes on a wheel.",
    createdAt: new Date().toISOString(),
  };

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders message content', () => {
    expect(wrapper.find(Text).props().text).toBe(smsMessage1.body);
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().size).toBe('medium');
  });

  it('renders timestamp for past messages', () => {
    expect(wrapper.find(FormattedRelative).props().value).toBe(smsMessage1.createdAt);
    expect(wrapper.find(FormattedRelative).props().units).toBe('day');
  });

  it('truncates message content if needed', () => {
    wrapper.setProps({ smsMessage: newMessage });

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().text,
    ).toBe('Lannister, Targaryen, Baratheon, Stark,...');
  });

  it('renders timestamp if message within last day', () => {
    expect(wrapper.find(Text).length).toBe(2);

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().text,
    ).toBe(format(newMessage.createdAt, TIMESTAMP_FORMAT));
  });

  it('renders loading message if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Text).props().messageId).toBe('dashboard.loading');
  });
});
