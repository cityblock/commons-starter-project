import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { ContactMethodOptions, ContactTimeOptions } from '../../../graphql/types';
import FormLabel from '../../../shared/library/form-label/form-label';
import RadioInput from '../../../shared/library/radio-input/radio-input';
import { contactInfo, patient } from '../../../shared/util/test-data';
import ContactInfo from '../contact-info';
import EmailInfo from '../email-info/email-info';
import PhoneInfo from '../phone-info/phone-info';

describe('Render Patient Comtact Info Component', () => {
  const onChange = () => true;
  const wrapper = shallow(
    <ContactInfo
      contactInfo={contactInfo}
      patientId={patient.id}
      patientInfoId={patient.patientInfo.id}
      onChange={onChange}
    />,
  );

  it('renders email info', () => {
    const emailInfo = wrapper.find(EmailInfo);
    expect(emailInfo).toHaveLength(1);
  });

  it('renders phone info', () => {
    const phoneInfo = wrapper.find(PhoneInfo);
    expect(phoneInfo).toHaveLength(1);
  });

  it('renders contact info header', () => {
    expect(wrapper.find(FormattedMessage)).toHaveLength(1);
    expect(wrapper.find(FormattedMessage).props().id).toBe('contactInfo.sectionTitle');
  });

  it('renders toggles', () => {
    const formLabels = wrapper.find(FormLabel);
    expect(formLabels).toHaveLength(3);

    expect(formLabels.at(0).props().messageId).toBe('contactInfo.canReceiveCalls');
    expect(formLabels.at(1).props().messageId).toBe('contactInfo.preferredContactMethod');
    expect(formLabels.at(2).props().messageId).toBe('contactInfo.preferredContactTime');

    const radioInputs = wrapper.find(RadioInput);
    expect(radioInputs).toHaveLength(8);

    expect(radioInputs.at(0).props().name).toBe('canReceiveCalls');
    expect(radioInputs.at(0).props().value).toBe('false');
    expect(radioInputs.at(0).props().label).toBe('No');
    expect(radioInputs.at(0).props().checked).toBeFalsy();

    expect(radioInputs.at(1).props().name).toBe('canReceiveCalls');
    expect(radioInputs.at(1).props().value).toBe('true');
    expect(radioInputs.at(1).props().label).toBe('Yes');
    expect(radioInputs.at(1).props().checked).toBeTruthy();

    expect(radioInputs.at(2).props().name).toBe('preferredContactMethod');
    expect(radioInputs.at(2).props().value).toBe(ContactMethodOptions.phone);
    expect(radioInputs.at(2).props().label).toBe(ContactMethodOptions.phone);
    expect(radioInputs.at(2).props().checked).toBeTruthy();

    expect(radioInputs.at(3).props().name).toBe('preferredContactMethod');
    expect(radioInputs.at(3).props().value).toBe(ContactMethodOptions.email);
    expect(radioInputs.at(3).props().label).toBe(ContactMethodOptions.email);
    expect(radioInputs.at(3).props().checked).toBeFalsy();

    expect(radioInputs.at(4).props().name).toBe('preferredContactMethod');
    expect(radioInputs.at(4).props().value).toBe(ContactMethodOptions.text);
    expect(radioInputs.at(4).props().label).toBe(ContactMethodOptions.text);
    expect(radioInputs.at(4).props().checked).toBeFalsy();

    expect(radioInputs.at(5).props().name).toBe('preferredContactTime');
    expect(radioInputs.at(5).props().value).toBe(ContactTimeOptions.morning);
    expect(radioInputs.at(5).props().label).toBe(ContactTimeOptions.morning);
    expect(radioInputs.at(5).props().checked).toBeFalsy();

    expect(radioInputs.at(6).props().name).toBe('preferredContactTime');
    expect(radioInputs.at(6).props().value).toBe(ContactTimeOptions.afternoon);
    expect(radioInputs.at(6).props().label).toBe(ContactTimeOptions.afternoon);
    expect(radioInputs.at(6).props().checked).toBeTruthy();

    expect(radioInputs.at(7).props().name).toBe('preferredContactTime');
    expect(radioInputs.at(7).props().value).toBe(ContactTimeOptions.evening);
    expect(radioInputs.at(7).props().label).toBe(ContactTimeOptions.evening);
    expect(radioInputs.at(7).props().checked).toBeFalsy();
  });

  it('toggles can receive calls states', () => {
    wrapper.setProps({ contactInfo: { ...wrapper.props().contactInfo, canReceiveCalls: false } });
    let radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(0).props().value).toBe('false');
    expect(radioInputs.at(0).props().checked).toBeTruthy();

    expect(radioInputs.at(1).props().value).toBe('true');
    expect(radioInputs.at(1).props().checked).toBeFalsy();

    wrapper.setProps({ contactInfo: { ...wrapper.props().contactInfo, canReceiveCalls: null } });
    radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(0).props().checked).toBeFalsy();
    expect(radioInputs.at(1).props().checked).toBeFalsy();
  });

  it('toggles preferred contact method states', () => {
    wrapper.setProps({
      contactInfo: {
        ...wrapper.props().contactInfo,
        preferredContactMethod: ContactMethodOptions.email,
      },
    });
    let radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(2).props().value).toBe(ContactMethodOptions.phone);
    expect(radioInputs.at(2).props().checked).toBeFalsy();

    expect(radioInputs.at(3).props().value).toBe(ContactMethodOptions.email);
    expect(radioInputs.at(3).props().checked).toBeTruthy();

    expect(radioInputs.at(4).props().value).toBe(ContactMethodOptions.text);
    expect(radioInputs.at(4).props().checked).toBeFalsy();

    wrapper.setProps({
      contactInfo: {
        ...wrapper.props().contactInfo,
        preferredContactMethod: ContactMethodOptions.text,
      },
    });
    radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(2).props().value).toBe(ContactMethodOptions.phone);
    expect(radioInputs.at(2).props().checked).toBeFalsy();

    expect(radioInputs.at(3).props().value).toBe(ContactMethodOptions.email);
    expect(radioInputs.at(3).props().checked).toBeFalsy();

    expect(radioInputs.at(4).props().value).toBe(ContactMethodOptions.text);
    expect(radioInputs.at(4).props().checked).toBeTruthy();
  });

  it('toggles preferred contact time states', () => {
    wrapper.setProps({
      contactInfo: {
        ...wrapper.props().contactInfo,
        preferredContactTime: ContactTimeOptions.evening,
      },
    });
    let radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(5).props().value).toBe(ContactTimeOptions.morning);
    expect(radioInputs.at(5).props().checked).toBeFalsy();

    expect(radioInputs.at(6).props().value).toBe(ContactTimeOptions.afternoon);
    expect(radioInputs.at(6).props().checked).toBeFalsy();

    expect(radioInputs.at(7).props().value).toBe(ContactTimeOptions.evening);
    expect(radioInputs.at(7).props().checked).toBeTruthy();

    wrapper.setProps({
      contactInfo: {
        ...wrapper.props().contactInfo,
        preferredContactTime: ContactTimeOptions.morning,
      },
    });
    radioInputs = wrapper.find(RadioInput);

    expect(radioInputs.at(5).props().value).toBe(ContactTimeOptions.morning);
    expect(radioInputs.at(5).props().checked).toBeTruthy();

    expect(radioInputs.at(6).props().value).toBe(ContactTimeOptions.afternoon);
    expect(radioInputs.at(6).props().checked).toBeFalsy();

    expect(radioInputs.at(7).props().value).toBe(ContactTimeOptions.evening);
    expect(radioInputs.at(7).props().checked).toBeFalsy();
  });
});
