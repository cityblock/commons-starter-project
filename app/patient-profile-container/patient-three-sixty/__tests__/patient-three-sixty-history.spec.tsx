import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import Spinner from '../../../shared/library/spinner/spinner';
import {
  shortPatientScreeningToolSubmission,
  shortPatientScreeningToolSubmission2,
} from '../../../shared/util/test-data';
import { PatientThreeSixtyHistory } from '../patient-three-sixty-history';
import ScreeningToolHistory from '../screening-tool-history';

describe('Patient 360 History Component', () => {
  const patientId = 'shaggydog';
  const glassBreakId = 'lady';

  const wrapper = shallow(
    <PatientThreeSixtyHistory
      patientId={patientId}
      submissions={[shortPatientScreeningToolSubmission, shortPatientScreeningToolSubmission2]}
      glassBreakId={glassBreakId}
    />,
  );

  it('applies container styles', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders screening tool history for later submission', () => {
    expect(wrapper.find(ScreeningToolHistory).length).toBe(2);
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(0)
        .props().routeBase,
    ).toBe(`/patients/${patientId}`);
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(0)
        .props().submission,
    ).toEqual(shortPatientScreeningToolSubmission);
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(0)
        .props().prevSubmission,
    ).toEqual(shortPatientScreeningToolSubmission2);
  });

  it('renders screening tool history for earlier submission', () => {
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(1)
        .props().routeBase,
    ).toBe(`/patients/${patientId}`);
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(1)
        .props().submission,
    ).toEqual(shortPatientScreeningToolSubmission2);
    expect(
      wrapper
        .find(ScreeningToolHistory)
        .at(1)
        .props().prevSubmission,
    ).toBeNull();
  });

  it('renders empty placeholder if no prior submissions', () => {
    wrapper.setProps({ submissions: [] });

    expect(wrapper.find(ScreeningToolHistory).length).toBe(0);
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find(EmptyPlaceholder).props().headerMessageId).toBe('threeSixty.historyEmpty');
  });

  it('renders loading spinner if loading', () => {
    wrapper.setProps({ loading: true });
    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(ScreeningToolHistory).length).toBe(0);
  });
});
