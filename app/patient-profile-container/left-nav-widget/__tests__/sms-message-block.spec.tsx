import { shallow } from 'enzyme';
import React from 'react';
import Text from '../../../shared/library/text/text';
import { patient } from '../../../shared/util/test-data';
import SmsMessageBlock from '../sms-message-block';

describe('SMS Message Block Component', () => {
  it('returns loading message if loading', () => {
    const wrapper = shallow(
      <SmsMessageBlock loading={true} error={null} patient={patient} isConsented={true} />,
    );

    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.flex').length).toBe(1);

    expect(wrapper.find(Text).props().messageId).toBe('messages.loading');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().size).toBe('large');
  });

  it('returns error message if error', () => {
    const wrapper = shallow(
      <SmsMessageBlock loading={false} error="DEMOGORGON!" patient={patient} isConsented={true} />,
    );

    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.flex').length).toBe(1);

    expect(wrapper.find(Text).props().messageId).toBe('messages.errorLoading');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().size).toBe('large');
  });

  it('returns no consent message if patient did not consent', () => {
    const wrapper = shallow(
      <SmsMessageBlock loading={false} error={null} patient={patient} isConsented={false} />,
    );

    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.flex').length).toBe(1);

    expect(wrapper.find(Text).props().messageId).toBe('messages.noConsent');
    expect(wrapper.find(Text).props().color).toBe('black');
    expect(wrapper.find(Text).props().size).toBe('large');
  });

  it('returns message indicating that no primary phone set', () => {
    const patientNoPhone = {
      ...patient,
      patientInfo: {
        ...patient.patientInfo,
        primaryPhone: null,
      },
    };

    const wrapper = shallow(
      <SmsMessageBlock loading={false} error={null} patient={patientNoPhone} isConsented={true} />,
    );

    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find('.flex').length).toBe(0);

    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().messageId,
    ).toBe('messages.noPhone');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().isBold,
    ).toBeTruthy();

    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('messages.noPhoneDetail');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isBold,
    ).toBeFalsy();
  });
});
