import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import * as React from 'react';
import { patient, patientConcern, user } from '../../../shared/util/test-data';
import Divider from '../../shared/divider';
import CareTeam from '../care-team';
import Info from '../info';
import PatientInfo from '../patient-info';

describe('Printable MAP information component', () => {
  const wrapper = shallow(<Info patient={patient} carePlan={[patientConcern]} careTeam={[user]} />);

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(2);
  });

  it('renders dark gray divider', () => {
    expect(wrapper.find(Divider).props().color).toBe('darkGray');
  });

  it('renders patient info component', () => {
    expect(wrapper.find(PatientInfo).props().patient).toEqual(patient);
    expect(wrapper.find(PatientInfo).props().carePlan).toEqual([patientConcern]);
  });

  it('renders care team component', () => {
    expect(wrapper.find(CareTeam).props().careTeam).toEqual([user]);
  });
});
