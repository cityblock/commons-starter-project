import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import { shortPatientScreeningToolSubmission } from '../../../shared/util/test-data';
import { PatientThreeSixtyHistory } from '../patient-three-sixty-history';
import ScreeningToolHistory from '../screening-tool-history';

describe('Patient 360 History Component', () => {
  const patientId = 'shaggydog';

  const wrapper = shallow(
    <PatientThreeSixtyHistory
      patientId={patientId}
      submissions={[shortPatientScreeningToolSubmission]}
    />,
  );

  it('renders screening tool history for each submission', () => {
    expect(wrapper.find(ScreeningToolHistory).length).toBe(1);
    expect(wrapper.find(ScreeningToolHistory).props().routeBase).toBe(`/patients/${patientId}`);
    expect(wrapper.find(ScreeningToolHistory).props().submission).toEqual(
      shortPatientScreeningToolSubmission,
    );
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(ScreeningToolHistory).length).toBe(0);
  });
});
