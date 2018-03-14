import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../shared/util/test-data';
import LeftNavWidget from '../left-nav-widget/left-nav-widget';
import LeftNav from '../left-nav/left-nav';
import PatientProfileLeftNav from '../patient-profile-left-nav';

describe('Patient Profile Left Navigation', () => {
  const glassBreakId = 'nymeria';
  const wrapper = shallow(
    <PatientProfileLeftNav patient={patient} patientId={patient.id} glassBreakId={glassBreakId} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.leftPane').length).toBe(1);
  });

  it('renders left navigation', () => {
    expect(wrapper.find(LeftNav).props().patient).toEqual(patient);
  });

  it('renders left navigation widget', () => {
    expect(wrapper.find(LeftNavWidget).props().patientId).toBe(patient.id);
    expect(wrapper.find(LeftNavWidget).props().glassBreakId).toBe(glassBreakId);
  });
});
