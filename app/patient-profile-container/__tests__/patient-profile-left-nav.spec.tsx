import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../shared/util/test-data';
import LeftNavWidget from '../left-nav-widget/left-nav-widget';
import PatientLeftNavInfo from '../patient-left-nav-info';
import PatientMedications from '../patient-medications';
import PatientProblemList from '../patient-problem-list';
import PatientProfileLeftNav from '../patient-profile-left-nav';

describe('Patient Profile Left Navigation', () => {
  const glassBreakId = 'nymeria';
  const wrapper = shallow(
    <PatientProfileLeftNav patient={patient} patientId={patient.id} glassBreakId={glassBreakId} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.leftPane').length).toBe(1);
  });

  it('renders patient left navigation info', () => {
    expect(wrapper.find(PatientLeftNavInfo).props().patientId).toBe(patient.id);
    expect(wrapper.find(PatientLeftNavInfo).props().patient).toEqual(patient);
  });

  it('renders patient medication list', () => {
    expect(wrapper.find(PatientMedications).props().patientId).toBe(patient.id);
  });

  it('renders patient problem list', () => {
    expect(wrapper.find(PatientProblemList).props().patientId).toBe(patient.id);
  });

  it('renders left navigation widget', () => {
    expect(wrapper.find(LeftNavWidget).props().patientId).toBe(patient.id);
    expect(wrapper.find(LeftNavWidget).props().glassBreakId).toBe(glassBreakId);
  });
});
