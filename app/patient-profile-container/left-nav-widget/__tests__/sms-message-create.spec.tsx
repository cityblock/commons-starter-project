import { shallow } from 'enzyme';
import * as React from 'react';
import Text from '../../../shared/library/text/text';
import TextAreaWithButton from '../../../shared/library/textarea-with-button/textarea-with-button';
import { patient } from '../../../shared/util/test-data';
import { SmsMessageCreate } from '../sms-message-create';

describe('SMS Message Create Form', () => {
  const patientCanReceiveTexts = {
    ...patient,
    patientInfo: {
      ...patient.patientInfo,
      canReceiveTexts: true,
    },
  };

  const wrapper = shallow(
    <SmsMessageCreate
      createSmsMessage={jest.fn()}
      patient={patientCanReceiveTexts}
      loading={false}
      error={null}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders text area to input message', () => {
    expect(wrapper.find(TextAreaWithButton).props().value).toBeFalsy();
    expect(wrapper.find(TextAreaWithButton).props().placeholderMessageId).toBe(
      'messages.createPlaceholder',
    );
    expect(wrapper.find(TextAreaWithButton).props().submitMessageId).toBe('messages.send');
    expect(wrapper.find(TextAreaWithButton).props().loadingMessageId).toBe('messages.sending');
  });

  it('edits body of message', () => {
    const body = 'Winter is coming.';
    wrapper.setState({ body });

    expect(wrapper.find(TextAreaWithButton).props().value).toBe(body);
  });

  it('renders blocker if patient cannot receive texts', () => {
    wrapper.setProps({ patient });

    expect(wrapper.find('.container').length).toBe(2);
    expect(wrapper.find(Text).length).toBe(1);
  });

  it('renders blocker if loading', () => {
    wrapper.setProps({ loading: true, patient: patientCanReceiveTexts });

    expect(wrapper.find('.container').length).toBe(2);
    expect(wrapper.find(Text).length).toBe(1);
  });
});
