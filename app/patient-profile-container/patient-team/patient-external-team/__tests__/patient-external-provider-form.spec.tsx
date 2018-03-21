import { shallow } from 'enzyme';
import * as React from 'react';
import FormLabel from '../../../../shared/library/form-label/form-label';
import TextInput from '../../../../shared/library/text-input/text-input';
import ExternalProviderRoleSelect from '../external-provider-role-select';
import PatientExternalProviderForm from '../patient-external-provider-form';

describe('Render Patient External Provider Form', () => {
  const onChange = () => true;
  const hasFieldError = {};
  const wrapper = shallow(
    <PatientExternalProviderForm onChange={onChange} hasFieldError={hasFieldError} />,
  );

  it('renders empty external provider form', () => {
    const labels = wrapper.find(FormLabel);
    const inputs = wrapper.find(TextInput);
    const select = wrapper.find(ExternalProviderRoleSelect);
    expect(labels).toHaveLength(7);
    expect(inputs).toHaveLength(6);
    expect(select).toHaveLength(1);

    expect(labels.at(0).props().messageId).toBe('patientExternalProvider.agencyName');
    expect(inputs.at(0).props().value).toBeFalsy();
    expect(inputs.at(0).props().onChange).toBe(onChange);
    expect(inputs.at(0).props().name).toBe('agencyName');
    expect(inputs.at(0).props().hasError).toBeFalsy();
    expect(inputs.at(0).props().required).toBeTruthy();

    expect(labels.at(1).props().messageId).toBe('patientExternalProvider.firstName');
    expect(inputs.at(1).props().value).toBeFalsy();
    expect(inputs.at(1).props().onChange).toBe(onChange);
    expect(inputs.at(1).props().name).toBe('firstName');

    expect(labels.at(2).props().messageId).toBe('patientExternalProvider.lastName');
    expect(inputs.at(2).props().value).toBeFalsy();
    expect(inputs.at(2).props().onChange).toBe(onChange);
    expect(inputs.at(2).props().name).toBe('lastName');

    expect(labels.at(3).props().messageId).toBe('patientExternalProvider.role');
    expect(select.props().value).toBeFalsy();
    expect(select.props().onChange).toBe(onChange);
    expect(select.props().hasError).toBeFalsy();

    expect(labels.at(4).props().messageId).toBe('patientExternalProvider.roleFreeText');
    expect(inputs.at(3).props().value).toBeFalsy();
    expect(inputs.at(3).props().onChange).toBe(onChange);
    expect(inputs.at(3).props().name).toBe('roleFreeText');
    expect(inputs.at(0).props().hasError).toBeFalsy();

    expect(labels.at(5).props().messageId).toBe('patientExternalProvider.phoneNumber');
    expect(inputs.at(4).props().value).toBeFalsy();
    expect(inputs.at(4).props().onChange).toBe(onChange);
    expect(inputs.at(4).props().name).toBe('phoneNumber');
    expect(inputs.at(4).props().hasError).toBeFalsy();
    expect(inputs.at(4).props().required).toBeTruthy();

    expect(labels.at(6).props().messageId).toBe('patientExternalProvider.emailAddress');
    expect(inputs.at(5).props().value).toBeFalsy();
    expect(inputs.at(5).props().onChange).toBe(onChange);
    expect(inputs.at(5).props().name).toBe('emailAddress');
  });

  it('renders filled out external provider form', () => {
    wrapper.setProps({
      phoneNumber: '1',
      description: 'D',
      emailAddress: 'a',
      firstName: 'b',
      lastName: 'c',
      agencyName: 'e',
      role: 'OBGYN',
    });

    const inputs = wrapper.find(TextInput);

    expect(inputs.at(0).props().value).toBe('e');
    expect(inputs.at(0).props().name).toBe('agencyName');

    expect(inputs.at(1).props().value).toBe('b');
    expect(inputs.at(1).props().name).toBe('firstName');

    expect(inputs.at(2).props().value).toBe('c');
    expect(inputs.at(2).props().name).toBe('lastName');

    expect(wrapper.find(ExternalProviderRoleSelect).props().value).toBe('OBGYN');

    expect(inputs.at(3).props().value).toBeFalsy();
    expect(inputs.at(3).props().name).toBe('roleFreeText');

    expect(inputs.at(4).props().value).toBe('1');
    expect(inputs.at(4).props().name).toBe('phoneNumber');

    expect(inputs.at(5).props().value).toBe('a');
    expect(inputs.at(5).props().name).toBe('emailAddress');
  });

  it('renders form with field errors', () => {
    wrapper.setProps({
      hasFieldError: {
        role: true,
        roleFreeText: true,
        agencyName: true,
        phoneNumber: true,
      },
    });
    const inputs = wrapper.find(TextInput);

    expect(inputs.at(0).props().name).toBe('agencyName');
    expect(inputs.at(0).props().hasError).toBeTruthy();

    expect(wrapper.find(ExternalProviderRoleSelect).props().hasError).toBeTruthy();

    expect(inputs.at(3).props().name).toBe('roleFreeText');
    expect(inputs.at(3).props().hasError).toBeTruthy();

    expect(inputs.at(4).props().name).toBe('phoneNumber');
    expect(inputs.at(4).props().hasError).toBeTruthy();
  });
});
