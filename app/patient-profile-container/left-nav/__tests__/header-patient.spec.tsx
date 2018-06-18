import { shallow } from 'enzyme';
import { capitalize } from 'lodash';
import React from 'react';
import {
  formatAge,
  formatPatientNameForProfile,
  getPatientStatusColor,
} from '../../../shared/helpers/format-helpers';
import PatientPhoto from '../../../shared/library/patient-photo/patient-photo';
import Text from '../../../shared/library/text/text';
import { patient } from '../../../shared/util/test-data';
import LeftNavHeaderPatient from '../header-patient';

describe('Patient Left Navigation Header: Patient Info', () => {
  const wrapper = shallow(<LeftNavHeaderPatient patient={patient} isWidgetOpen={false} />);

  it('renders container', () => {
    expect(
      wrapper
        .find('div')
        .at(0)
        .props().className,
    ).toBe('container');
  });

  it('renders patient photo', () => {
    expect(wrapper.find(PatientPhoto).props().patientId).toBe(patient.id);
    expect(wrapper.find(PatientPhoto).props().hasUploadedPhoto).toBe(
      patient.patientInfo.hasUploadedPhoto,
    );
    expect(wrapper.find(PatientPhoto).props().gender).toBe(patient.patientInfo.gender);
    expect(wrapper.find(PatientPhoto).props().type).toBe('squareLarge');
  });

  it('renders text for patient state', () => {
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().text,
    ).toBe(capitalize(patient.patientState.currentState));
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().color,
    ).toBe(getPatientStatusColor(patient.patientState.currentState));
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().size,
    ).toBe('medium');
    expect(
      wrapper
        .find(Text)
        .at(0)
        .props().isBold,
    ).toBeTruthy();
  });

  it('renders patient name', () => {
    expect(wrapper.find('h1').text()).toBe(formatPatientNameForProfile(patient));
    expect(wrapper.find('h1').props().className).toBe('patientName');
  });

  it('renders patient age', () => {
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageId,
    ).toBe('patientInfo.age');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().messageValues,
    ).toEqual({ age: formatAge(patient.dateOfBirth) });
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
        .props().color,
    ).toBe('black');
    expect(
      wrapper
        .find(Text)
        .at(1)
        .props().isBold,
    ).toBeTruthy();
  });

  it('does not render age or status if widget is open', () => {
    wrapper.setProps({ isWidgetOpen: true });

    expect(wrapper.find(Text).length).toBe(0);
  });

  it('has smaller patient name text if widget is open', () => {
    expect(wrapper.find('h1').props().className).toBe('patientNameOpen');
  });

  it('renders smaller patient photo if widget is open', () => {
    expect(wrapper.find(PatientPhoto).props().type).toBe('square');
  });
});
