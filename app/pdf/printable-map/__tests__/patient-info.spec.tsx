import { Text, View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, patientConcern } from '../../../shared/util/test-data';
import PatientHeader from '../../shared/patient-header';
import copy from '../copy/copy';
import MapSummary from '../map-summary';
import PatientInfo from '../patient-info';

describe('Printable MAP patient info (left pane)', () => {
  const profilePhotoUrl = '/king/in/the/north.com';

  const wrapper = shallow(
    <PatientInfo patient={patient} carePlan={[patientConcern]} profilePhotoUrl={profilePhotoUrl} />,
  );

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders patient header', () => {
    expect(wrapper.find(PatientHeader).props().patient).toEqual(patient);
    expect(wrapper.find(PatientHeader).props().profilePhotoUrl).toBe(profilePhotoUrl);
  });

  it('renders overview of MAP', () => {
    expect(wrapper.find(Text).text()).toBe(copy.mapInfo);
  });

  it('renders MAP summary counts component', () => {
    expect(wrapper.find(MapSummary).props().carePlan).toEqual([patientConcern]);
  });
});
