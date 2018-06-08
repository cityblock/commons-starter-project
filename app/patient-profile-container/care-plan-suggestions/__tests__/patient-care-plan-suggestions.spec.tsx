import { shallow } from 'enzyme';
import * as React from 'react';
import { fullCarePlanSuggestionWithConcern } from '../../../shared/util/test-data';
import { PatientCarePlanSuggestions } from '../patient-care-plan-suggestions';
import PopupPatientCarePlanSuggestionAccepted, {
  IProps,
} from '../popup-patient-care-plan-suggestion-accepted';

it('renders patient care plan suggestions', () => {
  const riskArea = fullCarePlanSuggestionWithConcern.riskArea;
  const riskAreaAssessmentSuggestionGroups = {
    [riskArea.id]: [fullCarePlanSuggestionWithConcern],
  };
  const riskAreaLabels = { [riskArea.id]: riskArea.title };

  const wrapper = shallow(
    <PatientCarePlanSuggestions
      riskAreaAssessmentSuggestionGroups={riskAreaAssessmentSuggestionGroups}
      computedFieldSuggestionGroups={null}
      screeningToolSuggestionGroups={null}
      allSuggestions={[fullCarePlanSuggestionWithConcern]}
      patientId={fullCarePlanSuggestionWithConcern.patientId}
      routeBase={'/patients/patient-1/map'}
      glassBreakId="lady"
      riskAreaLabels={riskAreaLabels}
    />,
  );
  const suggestionAccepted = wrapper.find<IProps>(PopupPatientCarePlanSuggestionAccepted as any);
  expect(suggestionAccepted.props().patientId).toBe(fullCarePlanSuggestionWithConcern.patientId);
});
