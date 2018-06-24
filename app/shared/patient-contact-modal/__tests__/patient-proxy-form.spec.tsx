import { shallow } from 'enzyme';
import React from 'react';
import FormLabel from '../../library/form-label/form-label';
import Select from '../../library/select/select';
import TextInput from '../../library/text-input/text-input';
import PatientProxyForm from '../patient-proxy-form';

describe('Render Patient Proxy Form', () => {
  const onChange = () => true;
  const hasFieldError = {};
  const wrapper = shallow(<PatientProxyForm onChange={onChange} hasFieldError={hasFieldError} />);

  it('renders empty proxy form', () => {
    const labels = wrapper.find(FormLabel);
    const inputs = wrapper.find(TextInput);
    const select = wrapper.find(Select);
    expect(labels).toHaveLength(8);
    expect(inputs).toHaveLength(6);
    expect(select).toHaveLength(2);

    expect(labels.at(0).props().messageId).toBe('patientContact.firstName');
    expect(inputs.at(0).props().value).toBeFalsy();
    expect(inputs.at(0).props().onChange).toBe(onChange);
    expect(inputs.at(0).props().name).toBe('firstName');
    expect(inputs.at(0).props().hasError).toBeFalsy();
    expect(inputs.at(0).props().required).toBeTruthy();

    expect(labels.at(1).props().messageId).toBe('patientContact.lastName');
    expect(inputs.at(1).props().value).toBeFalsy();
    expect(inputs.at(1).props().onChange).toBe(onChange);
    expect(inputs.at(1).props().name).toBe('lastName');
    expect(inputs.at(1).props().hasError).toBeFalsy();
    expect(inputs.at(1).props().required).toBeTruthy();

    expect(labels.at(2).props().messageId).toBe('patientContact.relationToPatient');
    expect(select.at(0).props().value).toBeFalsy();
    expect(select.at(0).props().onChange).toBe(onChange);
    expect(select.at(0).props().name).toBe('relationToPatient');
    expect(select.at(0).props().hasError).toBeFalsy();

    expect(labels.at(3).props().messageId).toBe('patientContact.relationFreeText');
    expect(inputs.at(2).props().value).toBeFalsy();
    expect(inputs.at(2).props().onChange).toBe(onChange);
    expect(inputs.at(2).props().name).toBe('relationFreeText');
    expect(inputs.at(2).props().hasError).toBeFalsy();
    expect(inputs.at(2).props().required).toBeTruthy();

    expect(labels.at(4).props().messageId).toBe('patientContact.phoneNumber');
    expect(inputs.at(3).props().value).toBeFalsy();
    expect(inputs.at(3).props().onChange).toBe(onChange);
    expect(inputs.at(3).props().name).toBe('phoneNumber');
    expect(inputs.at(3).props().hasError).toBeFalsy();
    expect(inputs.at(3).props().required).toBeTruthy();

    expect(labels.at(5).props().messageId).toBe('phone.type');
    expect(select.at(1).props().value).toBeFalsy();
    expect(select.at(1).props().onChange).toBe(onChange);
    expect(select.at(1).props().name).toBe('phoneType');
    expect(select.at(1).props().hasError).toBeFalsy();

    expect(labels.at(6).props().messageId).toBe('patientContact.emailAddress');
    expect(inputs.at(4).props().value).toBeFalsy();
    expect(inputs.at(4).props().onChange).toBe(onChange);
    expect(inputs.at(4).props().name).toBe('emailAddress');

    expect(labels.at(7).props().messageId).toBe('patientContact.proxyDescription');
    expect(inputs.at(5).props().value).toBeFalsy();
    expect(inputs.at(5).props().onChange).toBe(onChange);
    expect(inputs.at(5).props().name).toBe('description');
  });

  it('renders filled out proxy form', () => {
    wrapper.setProps({
      phoneNumber: '1',
      phoneType: 'mobile',
      description: 'D',
      emailAddress: 'a',
      firstName: 'b',
      lastName: 'c',
      relationFreeText: 'e',
      relationToPatient: 'other',
    });

    const inputs = wrapper.find(TextInput);
    const select = wrapper.find(Select);
    expect(inputs).toHaveLength(6);
    expect(select).toHaveLength(2);

    expect(inputs.at(0).props().value).toBe('b');
    expect(inputs.at(0).props().name).toBe('firstName');

    expect(inputs.at(1).props().value).toBe('c');
    expect(inputs.at(1).props().name).toBe('lastName');

    expect(select.at(0).props().value).toBe('other');
    expect(select.at(0).props().name).toBe('relationToPatient');

    expect(select.at(1).props().value).toBe('mobile');
    expect(select.at(1).props().name).toBe('phoneType');

    expect(inputs.at(2).props().value).toBe('e');
    expect(inputs.at(2).props().name).toBe('relationFreeText');

    expect(inputs.at(3).props().value).toBe('1');
    expect(inputs.at(3).props().name).toBe('phoneNumber');

    expect(inputs.at(4).props().value).toBe('a');
    expect(inputs.at(4).props().name).toBe('emailAddress');

    expect(inputs.at(5).props().value).toBe('D');
    expect(inputs.at(5).props().name).toBe('description');
  });

  it('renders form with field errors', () => {
    wrapper.setProps({
      hasFieldError: {
        firstName: true,
        lastName: true,
        relationToPatient: true,
        relationFreeText: true,
        phoneNumber: true,
        phoneType: true,
      },
    });
    const inputs = wrapper.find(TextInput);
    const select = wrapper.find(Select);

    expect(inputs.at(0).props().name).toBe('firstName');
    expect(inputs.at(0).props().hasError).toBeTruthy();

    expect(inputs.at(1).props().name).toBe('lastName');
    expect(inputs.at(1).props().hasError).toBeTruthy();

    expect(select.at(0).props().name).toBe('relationToPatient');
    expect(select.at(0).props().hasError).toBeTruthy();

    expect(select.at(1).props().name).toBe('phoneType');
    expect(select.at(1).props().hasError).toBeTruthy();

    expect(inputs.at(2).props().name).toBe('relationFreeText');
    expect(inputs.at(2).props().hasError).toBeTruthy();

    expect(inputs.at(3).props().name).toBe('phoneNumber');
    expect(inputs.at(3).props().hasError).toBeTruthy();
  });
});
