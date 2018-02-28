import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, patientConcern } from '../../../shared/util/test-data';
import BodyText from '../../shared/body-text';
import copy from '../copy/copy';
import MapSummary from '../map-summary';
import PatientHeader from '../patient-header';
import PatientInfo from '../patient-info';

describe('Printable MAP patient info (left pane)', () => {
  const wrapper = shallow(<PatientInfo patient={patient} carePlan={[patientConcern]} />);

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders patient header', () => {
    expect(wrapper.find(PatientHeader).props().patient).toEqual(patient);
  });

  it('renders overview of MAP', () => {
    expect(wrapper.find(BodyText).props().label).toBe(copy.mapInfo);
    expect(wrapper.find(BodyText).props().small).toBeTruthy();
    expect(wrapper.find(BodyText).props().noMargin).toBeTruthy();
  });

  it('renders MAP summary counts component', () => {
    expect(wrapper.find(MapSummary).props().carePlan).toEqual([patientConcern]);
  });
});
