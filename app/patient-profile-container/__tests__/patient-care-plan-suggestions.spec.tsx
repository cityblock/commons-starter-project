import { shallow } from 'enzyme';
import * as React from 'react';
import { carePlanSuggestionWithConcern } from '../../shared/util/test-data';
import { PatientCarePlanSuggestions as Component } from '../patient-care-plan-suggestions';
import PopupPatientCarePlanSuggestionAccepted, {
  IProps,
} from '../popup-patient-care-plan-suggestion-accepted';

it('renders patient care plan suggestions', () => {
  const wrapper = shallow(
    <Component
      loading={false}
      error={null}
      carePlanSuggestions={[carePlanSuggestionWithConcern]}
      patientId={carePlanSuggestionWithConcern.patientId}
      routeBase={'/patients/patient-1/map'}
      glassBreakId="lady"
    />,
  );
  const suggestionAccepted = wrapper.find<IProps>(PopupPatientCarePlanSuggestionAccepted as any);
  expect(suggestionAccepted.props().patientId).toBe(carePlanSuggestionWithConcern.patientId);
});
