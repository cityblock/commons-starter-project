import { shallow } from 'enzyme';
import React from 'react';
import AddressForm from '../../../../shared/address-modal/address-form';
import FormLabel from '../../../../shared/library/form-label/form-label';
import TextInput from '../../../../shared/library/text-input/text-input';
import PatientExternalOrganizationForm from '../patient-external-organization-form';

describe('Render Patient External Organization Form', () => {
  const onChange = () => true;
  const hasFieldError = {};
  const wrapper = shallow(
    <PatientExternalOrganizationForm onChange={onChange} hasFieldError={hasFieldError} />,
  );

  it('renders empty external organization form', () => {
    const labels = wrapper.find(FormLabel);
    const inputs = wrapper.find(TextInput);
    const addressForm = wrapper.find(AddressForm);
    expect(labels).toHaveLength(3);
    expect(inputs).toHaveLength(3);
    expect(addressForm).toHaveLength(1);

    expect(labels.at(0).props().messageId).toBe('patientExternalOrganization.name');
    expect(inputs.at(0).props().value).toBeFalsy();
    expect(inputs.at(0).props().onChange).toBe(onChange);
    expect(inputs.at(0).props().name).toBe('name');

    expect(labels.at(1).props().messageId).toBe('patientExternalOrganization.phoneNumber');
    expect(inputs.at(1).props().value).toBeFalsy();
    expect(inputs.at(1).props().onChange).toBe(onChange);
    expect(inputs.at(1).props().name).toBe('phoneNumber');

    expect(labels.at(2).props().messageId).toBe('patientExternalOrganization.faxNumber');
    expect(inputs.at(2).props().value).toBeFalsy();
    expect(inputs.at(2).props().onChange).toBe(onChange);
    expect(inputs.at(2).props().name).toBe('faxNumber');
    expect(inputs.at(2).props().hasError).toBeFalsy();

    expect(addressForm.props().street1).toBeFalsy();
    expect(addressForm.props().street2).toBeFalsy();
    expect(addressForm.props().state).toBeFalsy();
    expect(addressForm.props().city).toBeFalsy();
    expect(addressForm.props().zip).toBeFalsy();
    expect(addressForm.props().onChange).toBe(onChange);
    expect(addressForm.props().hasError).toBeFalsy();
  });

  it('renders filled out external organization form', () => {
    wrapper.setProps({
      name: 'M',
      phoneNumber: '22',
      faxNumber: '421',
      description: 'D',
      zip: '02',
      street1: 'b',
      street2: 'c',
      city: 'e',
      state: 'CA',
    });

    const inputs = wrapper.find(TextInput);
    const addressForm = wrapper.find(AddressForm);

    expect(inputs.at(0).props().value).toBe('M');
    expect(inputs.at(0).props().name).toBe('name');

    expect(inputs.at(1).props().value).toBe('22');
    expect(inputs.at(1).props().name).toBe('phoneNumber');

    expect(inputs.at(2).props().value).toBe('421');
    expect(inputs.at(2).props().name).toBe('faxNumber');

    expect(addressForm.props().street1).toBe('b');
    expect(addressForm.props().street2).toBe('c');
    expect(addressForm.props().state).toBe('CA');
    expect(addressForm.props().city).toBe('e');
    expect(addressForm.props().zip).toBe('02');
  });

  it('renders form with field errors', () => {
    wrapper.setProps({
      hasFieldError: { name: true },
    });
    const inputs = wrapper.find(TextInput);
    expect(inputs.at(0).props().name).toBe('name');
    expect(inputs.at(0).props().hasError).toBeTruthy();
  });
});
