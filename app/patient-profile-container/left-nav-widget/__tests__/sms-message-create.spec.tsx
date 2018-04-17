import { shallow } from 'enzyme';
import * as React from 'react';
import Button from '../../../shared/library/button/button';
import TextArea from '../../../shared/library/textarea/textarea';
import { SmsMessageCreate } from '../sms-message-create';

describe('SMS Message Create Form', () => {
  const wrapper = shallow(
    <SmsMessageCreate createSmsMessage={() => true as any} patientId="aryaStark" />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders content', () => {
    expect(wrapper.find('.content').length).toBe(1);
  });

  it('renders text area to input message', () => {
    expect(wrapper.find(TextArea).props().value).toBeFalsy();
    expect(wrapper.find(TextArea).props().placeholderMessageId).toBe('messages.createPlaceholder');
    expect(wrapper.find(TextArea).props().className).toBe('input');
  });

  it('edits body of message', () => {
    const body = 'Winter is coming.';
    wrapper.setState({ body });

    expect(wrapper.find(TextArea).props().value).toBe(body);
  });

  it('renders button to send message', () => {
    expect(wrapper.find(Button).props().messageId).toBe('messages.send');
    expect(wrapper.find(Button).props().color).toBe('white');
    expect(wrapper.find(Button).props().disabled).toBeFalsy();
    expect(wrapper.find(Button).props().className).toBe('button');
  });

  it('disables button to send if loading', () => {
    wrapper.setState({ loading: true });

    expect(wrapper.find(Button).props().disabled).toBeTruthy();
  });
});
