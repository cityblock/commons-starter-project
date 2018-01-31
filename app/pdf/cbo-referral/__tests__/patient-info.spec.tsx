import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { formatDateOfBirth, formatGender } from '../../../shared/helpers/format-helpers';
import { patient } from '../../../shared/util/test-data';
import copy from '../copy/copy';
import PatientInfo from '../patient-info';
import TextGroup from '../text-group';

describe('CBO Referral PDF Patient Info', () => {
  const description = 'King In the North';
  const wrapper = shallow(<PatientInfo patient={patient as any} description={description} />);

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(6);
  });

  it('renders patient first name', () => {
    expect(wrapper.find(TextGroup).length).toBe(11);

    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().headerLabel,
    ).toBe(copy.patientFirstName);
    expect(
      wrapper
        .find(TextGroup)
        .at(0)
        .props().bodyLabel,
    ).toBe(patient.firstName);
  });

  it('renders patient last name', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().headerLabel,
    ).toBe(copy.patientLastName);
    expect(
      wrapper
        .find(TextGroup)
        .at(1)
        .props().bodyLabel,
    ).toBe(patient.lastName);
  });

  it('renders patient cityblock ID', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(2)
        .props().headerLabel,
    ).toBe(copy.patientCityblockID);
  });

  it('renders patient date of birth', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(3)
        .props().headerLabel,
    ).toBe(copy.patientDoB);
    expect(
      wrapper
        .find(TextGroup)
        .at(3)
        .props().bodyLabel,
    ).toBe(formatDateOfBirth(patient.dateOfBirth));
  });

  it('renders patient gender', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(4)
        .props().headerLabel,
    ).toBe(copy.patientGender);
    expect(
      wrapper
        .find(TextGroup)
        .at(4)
        .props().bodyLabel,
    ).toBe(formatGender(patient.gender));
  });

  it('renders patient language', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(5)
        .props().headerLabel,
    ).toBe(copy.patientLanguage);
    expect(
      wrapper
        .find(TextGroup)
        .at(5)
        .props().bodyLabel,
    ).toBe(patient.language);
  });

  it('renders patient phone number', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(6)
        .props().headerLabel,
    ).toBe(copy.patientPhone);
  });

  it('renders patient address', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(7)
        .props().headerLabel,
    ).toBe(copy.patientAddress);
    expect(
      wrapper
        .find(TextGroup)
        .at(7)
        .props().size,
    ).toBe('medium');
  });

  it('renders patient insurance plan', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(8)
        .props().headerLabel,
    ).toBe(copy.patientInsurancePlan);
  });

  it('renders patient insurance ID', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(9)
        .props().headerLabel,
    ).toBe(copy.patientInsuranceID);
  });

  it('renders referral note', () => {
    expect(
      wrapper
        .find(TextGroup)
        .at(10)
        .props().headerLabel,
    ).toBe(copy.referralNote);
    expect(
      wrapper
        .find(TextGroup)
        .at(10)
        .props().size,
    ).toBe('large');
    expect(
      wrapper
        .find(TextGroup)
        .at(10)
        .props().bodyLabel,
    ).toBe(description);
  });

  it('renders N/A if no referral note', () => {
    wrapper.setProps({ description: null });

    expect(
      wrapper
        .find(TextGroup)
        .at(10)
        .props().bodyLabel,
    ).toBe(copy.notAvailable);
  });
});
