import { shallow } from 'enzyme';
import React from 'react';
import {
  advancedDirectives,
  basicInfo,
  contactInfo,
  coreIdentity,
  patient,
  patientPhoto,
  planInfo,
} from '../../../shared/util/test-data';
import AdvancedDirectives from '../advanced-directives';
import BasicInfo from '../basic-info';
import ContactInfo from '../contact-info';
import CoreIdentity from '../core-identity';
import { PatientDemographics } from '../patient-demographics';
import PatientPhoto from '../patient-photo';
import PlanInfo from '../plan-info';

describe('Render Patient Demographics Component', () => {
  const onChange = () => true;
  const location = {} as any;
  const match = {} as any;
  const history = { push: jest.fn() } as any;

  const wrapper = shallow(
    <PatientDemographics
      patient={{
        core: coreIdentity,
        basic: basicInfo,
        contact: contactInfo,
        plan: planInfo,
        advanced: advancedDirectives,
        photo: patientPhoto,
        patientId: patient.id,
        patientInfoId: patient.patientInfo.id,
      }}
      routeBase={'/foo/bar'}
      onChange={onChange}
      staticContext={{} as any}
      location={location}
      match={match}
      history={history}
    />,
  );

  it('renders core identity', () => {
    expect(wrapper.find(CoreIdentity)).toHaveLength(1);
    expect(wrapper.find(CoreIdentity).props().patientIdentity).toBe(coreIdentity);
    expect(wrapper.find(CoreIdentity).props().patientId).toBe(patient.id);
  });

  it('renders basic info', () => {
    expect(wrapper.find(BasicInfo)).toHaveLength(1);
  });

  it('renders contact info', () => {
    expect(wrapper.find(ContactInfo)).toHaveLength(1);
    expect(wrapper.find(ContactInfo).props().contactInfo).toBe(contactInfo);
    expect(wrapper.find(ContactInfo).props().patientId).toBe(patient.id);
    expect(wrapper.find(ContactInfo).props().patientInfoId).toBe(patient.patientInfo.id);
  });

  it('renders plan info', () => {
    expect(wrapper.find(PlanInfo)).toHaveLength(1);
    expect(wrapper.find(PlanInfo).props().planInfo).toBe(planInfo);
    expect(wrapper.find(PlanInfo).props().patientId).toBe(patient.id);
  });

  it('advance directive', () => {
    expect(wrapper.find(AdvancedDirectives)).toHaveLength(1);
  });

  it('renders patient photo', () => {
    expect(wrapper.find(PatientPhoto).props().patientId).toBe(patient.id);
    expect(wrapper.find(PatientPhoto).props().patientInfoId).toBe(patient.patientInfo.id);
    expect(wrapper.find(PatientPhoto).props().gender).toBe(basicInfo.gender);
    expect(wrapper.find(PatientPhoto).props().patientPhoto).toEqual(patientPhoto);
  });
});
