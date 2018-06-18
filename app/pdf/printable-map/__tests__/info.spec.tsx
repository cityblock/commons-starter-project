import { View } from '@react-pdf/core';
import { shallow } from 'enzyme';
import React from 'react';
import { patient, patientConcern, userForCareTeam } from '../../../shared/util/test-data';
import CareTeam from '../care-team';
import Info from '../info';
import PatientInfo from '../patient-info';

describe('Printable MAP information component', () => {
  const profilePhotoUrl = '/lady/of/winterfell.com';
  const wrapper = shallow(
    <Info
      patient={patient}
      carePlan={[patientConcern]}
      careTeam={[userForCareTeam]}
      profilePhotoUrl={profilePhotoUrl}
    />,
  );

  it('renders container views', () => {
    expect(wrapper.find(View).length).toBe(1);
  });

  it('renders patient info component', () => {
    expect(wrapper.find(PatientInfo).props().patient).toEqual(patient);
    expect(wrapper.find(PatientInfo).props().profilePhotoUrl).toBe(profilePhotoUrl);
    expect(wrapper.find(PatientInfo).props().carePlan).toEqual([patientConcern]);
  });

  it('renders care team component', () => {
    expect(wrapper.find(CareTeam).props().careTeam).toEqual([userForCareTeam]);
  });
});
