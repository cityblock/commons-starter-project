import { shallow } from 'enzyme';
import React from 'react';
import FormLabel from '../../../../shared/library/form-label/form-label';
import Select from '../../../../shared/library/select/select';
import TextInput from '../../../../shared/library/text-input/text-input';
import { externalOrganization } from '../../../../shared/util/test-data';
import ExternalProviderRoleSelect from '../external-provider-role-select';
import PatientExternalProviderForm from '../patient-external-provider-form';

describe('Render Patient External Provider Form', () => {
  const onChange = () => true;
  const hasFieldError = {};
  const wrapper = shallow(
    <PatientExternalProviderForm
      onChange={onChange}
      hasFieldError={hasFieldError}
      patientExternalOrganizations={[externalOrganization]}
    />,
  );

  it('renders empty external provider form', () => {
    const labels = wrapper.find(FormLabel);
    const inputs = wrapper.find(TextInput);
    const select = wrapper.find(Select);
    const providerSelect = wrapper.find(ExternalProviderRoleSelect);
    expect(labels).toHaveLength(8);
    expect(inputs).toHaveLength(5);
    expect(providerSelect).toHaveLength(1);
    expect(select).toHaveLength(2);

    expect(labels.at(0).props().messageId).toBe('patientExternalProvider.organization');
    expect(select.at(1).props().value).toBeFalsy();
    expect(select.at(1).props().onChange).toBe(onChange);
    expect(select.at(1).props().hasError).toBeFalsy();

    expect(labels.at(1).props().messageId).toBe('patientExternalProvider.firstName');
    expect(inputs.at(0).props().value).toBeFalsy();
    expect(inputs.at(0).props().onChange).toBe(onChange);
    expect(inputs.at(0).props().name).toBe('firstName');

    expect(labels.at(2).props().messageId).toBe('patientExternalProvider.lastName');
    expect(inputs.at(1).props().value).toBeFalsy();
    expect(inputs.at(1).props().onChange).toBe(onChange);
    expect(inputs.at(1).props().name).toBe('lastName');

    expect(labels.at(3).props().messageId).toBe('patientExternalProvider.role');
    expect(providerSelect.at(0).props().value).toBeFalsy();
    expect(providerSelect.at(0).props().onChange).toBe(onChange);
    expect(providerSelect.at(0).props().hasError).toBeFalsy();

    expect(labels.at(4).props().messageId).toBe('patientExternalProvider.roleFreeText');
    expect(inputs.at(2).props().value).toBeFalsy();
    expect(inputs.at(2).props().onChange).toBe(onChange);
    expect(inputs.at(2).props().name).toBe('roleFreeText');
    expect(inputs.at(2).props().hasError).toBeFalsy();

    expect(labels.at(5).props().messageId).toBe('patientExternalProvider.phoneNumber');
    expect(inputs.at(3).props().value).toBeFalsy();
    expect(inputs.at(3).props().onChange).toBe(onChange);
    expect(inputs.at(3).props().name).toBe('phoneNumber');
    expect(inputs.at(3).props().hasError).toBeFalsy();
    expect(inputs.at(3).props().required).toBeTruthy();

    expect(labels.at(6).props().messageId).toBe('phone.type');
    expect(select.at(1).props().value).toBeFalsy();
    expect(select.at(1).props().onChange).toBe(onChange);
    expect(select.at(1).props().hasError).toBeFalsy();

    expect(labels.at(7).props().messageId).toBe('patientExternalProvider.emailAddress');
    expect(inputs.at(4).props().value).toBeFalsy();
    expect(inputs.at(4).props().onChange).toBe(onChange);
    expect(inputs.at(4).props().name).toBe('emailAddress');
  });

  it('renders filled out external provider form', () => {
    wrapper.setProps({
      phoneNumber: '1',
      phoneType: 'work',
      description: 'D',
      emailAddress: 'a',
      firstName: 'b',
      lastName: 'c',
      patientExternalOrganizationId: 'e',
      role: 'OBGYN',
    });

    const inputs = wrapper.find(TextInput);
    const selects = wrapper.find(Select);

    expect(selects.at(0).props().value).toBe('e');
    expect(selects.at(0).props().name).toBe('patientExternalOrganizationId');

    expect(inputs.at(0).props().value).toBe('b');
    expect(inputs.at(0).props().name).toBe('firstName');

    expect(inputs.at(1).props().value).toBe('c');
    expect(inputs.at(1).props().name).toBe('lastName');

    expect(wrapper.find(ExternalProviderRoleSelect).props().value).toBe('OBGYN');

    expect(inputs.at(2).props().value).toBeFalsy();
    expect(inputs.at(2).props().name).toBe('roleFreeText');

    expect(inputs.at(3).props().value).toBe('1');
    expect(inputs.at(3).props().name).toBe('phoneNumber');

    expect(selects.at(1).props().value).toBe('work');

    expect(inputs.at(4).props().value).toBe('a');
    expect(inputs.at(4).props().name).toBe('emailAddress');
  });

  it('renders form with field errors', () => {
    wrapper.setProps({
      hasFieldError: {
        role: true,
        roleFreeText: true,
        patientExternalOrganizationId: true,
        phoneNumber: true,
      },
    });
    const inputs = wrapper.find(TextInput);

    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().name,
    ).toBe('patientExternalOrganizationId');
    expect(
      wrapper
        .find(Select)
        .at(0)
        .props().hasError,
    ).toBeTruthy();

    expect(wrapper.find(ExternalProviderRoleSelect).props().hasError).toBeTruthy();

    expect(inputs.at(2).props().name).toBe('roleFreeText');
    expect(inputs.at(2).props().hasError).toBeTruthy();

    expect(inputs.at(3).props().name).toBe('phoneNumber');
    expect(inputs.at(3).props().hasError).toBeTruthy();
  });
});
