import { shallow } from 'enzyme';
import * as React from 'react';
import PatientThreeSixtyDomains from '../patient-three-sixty-domains';
import PatientThreeSixtyView from '../patient-three-sixty-view';

describe('Patient 360 View Component', () => {
  const patientId = 'sansaStark';

  const match = {
    params: {
      patientId,
    },
  };

  const wrapper = shallow(<PatientThreeSixtyView match={match} />);

  it('renders 360 domains view if not viewing domain or assessment', () => {
    expect(wrapper.find(PatientThreeSixtyDomains).length).toBe(1);
    expect(wrapper.find(PatientThreeSixtyDomains).props().patientId).toBe(patientId);
  });
});
