import { shallow } from 'enzyme';
import * as React from 'react';
import TextAreaWithButton from '../../../shared/library/textarea-with-button/textarea-with-button';
import { SmsMessageCreate } from '../sms-message-create';

describe('SMS Message Create Form', () => {
  const wrapper = shallow(
    <SmsMessageCreate createSmsMessage={() => true as any} patientId="aryaStark" />,
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
});
