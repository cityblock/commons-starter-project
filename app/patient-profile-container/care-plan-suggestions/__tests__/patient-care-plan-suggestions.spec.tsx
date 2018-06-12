import { shallow } from 'enzyme';
import * as React from 'react';
import { carePlanSuggestionWithConcern, fullCarePlanSuggestionWithConcern, riskArea } from '../../../shared/util/test-data';
import { PatientCarePlanSuggestions } from '../patient-care-plan-suggestions';
import PopupPatientCarePlanSuggestionAccepted from '../popup-patient-care-plan-suggestion-accepted';
import SuggestionsSection from '../suggestions-section';

describe('renders patient care plan suggestions', () => {
  const riskAreaAssessmentSuggestionGroups = {
    [riskArea.id]: [fullCarePlanSuggestionWithConcern],
  };
  const riskAreaLabels = { [riskArea.id]: riskArea.title };

  const suggestionWithComputedField = {
    ...carePlanSuggestionWithConcern,
    computedField: {
      id: 'cfID',
      label: 'computed field title',
      riskArea: {
        id: riskArea.id,
        title: riskArea.title,
      },
    },
  };
  const computedFieldSuggestionGroups = {
    cfID: [suggestionWithComputedField],
  };

  const suggestionWithScreeningTool = {
    ...carePlanSuggestionWithConcern,
    screeningTool: {
      id: 'stID',
      title: 'screening tool title',
    },
  };
  const screeningToolSuggestionGroups = {
    stID: [suggestionWithScreeningTool],
  };
  const screeningToolTitle = 'some label for screening tool that should normally be the title';
  const screeningToolLabels = { stID: screeningToolTitle };

  const wrapper = shallow(
    <PatientCarePlanSuggestions
      riskAreaAssessmentSuggestionGroups={riskAreaAssessmentSuggestionGroups}
      computedFieldSuggestionGroups={computedFieldSuggestionGroups}
      screeningToolSuggestionGroups={screeningToolSuggestionGroups}
      allSuggestions={[fullCarePlanSuggestionWithConcern, suggestionWithScreeningTool, suggestionWithComputedField]}
      patientId={fullCarePlanSuggestionWithConcern.patientId}
      routeBase={'/patients/patient-1/map'}
      glassBreakId="lady"
      riskAreaLabels={riskAreaLabels}
      screeningToolLabels={screeningToolLabels}
      sectionNameFilter={null}
      groupIdFilter={null}
    />,
  );

  it('renders component with three sections visible', () => {
    const sections = wrapper.find(SuggestionsSection);
    expect(sections).toHaveLength(3);

    const riskAreaSectionProps = sections.at(0).props();
    expect(riskAreaSectionProps.name).toBe('riskAreaAssessment');
    expect(riskAreaSectionProps.suggestionGroups).toBe(riskAreaAssessmentSuggestionGroups);
    expect(riskAreaSectionProps.selectedGroupId).toBeFalsy();
    expect(riskAreaSectionProps.labels).toBe(riskAreaLabels);
    expect(riskAreaSectionProps.groupIdFilter).toBeFalsy();
    expect(riskAreaSectionProps.isHidden).toBeFalsy();

    const screeningToolSectionProps = sections.at(1).props();
    expect(screeningToolSectionProps.name).toBe('screeningTool');
    expect(screeningToolSectionProps.suggestionGroups).toBe(screeningToolSuggestionGroups);
    expect(screeningToolSectionProps.selectedGroupId).toBeFalsy();
    expect(screeningToolSectionProps.labels).toBe(screeningToolLabels);
    expect(screeningToolSectionProps.groupIdFilter).toBeFalsy();
    expect(screeningToolSectionProps.isHidden).toBeFalsy();

    const computedFieldSectionProps = sections.at(2).props();
    expect(computedFieldSectionProps.name).toBe('computedField');
    expect(computedFieldSectionProps.suggestionGroups).toBe(computedFieldSuggestionGroups);
    expect(computedFieldSectionProps.selectedGroupId).toBeFalsy();
    expect(computedFieldSectionProps.labels).toBe(riskAreaLabels);
    expect(computedFieldSectionProps.groupIdFilter).toBeFalsy();
    expect(computedFieldSectionProps.isHidden).toBeFalsy();
  });

  it('renders suggestion accepted popup with no state', () => {
    const suggestionAccepted = wrapper.find(PopupPatientCarePlanSuggestionAccepted);
    expect(suggestionAccepted.props().patientId).toBe(fullCarePlanSuggestionWithConcern.patientId);
    expect(suggestionAccepted.props().carePlanSuggestions).toHaveLength(3);
    expect(suggestionAccepted.props().carePlanSuggestions).toContain(fullCarePlanSuggestionWithConcern);
    expect(suggestionAccepted.props().carePlanSuggestions).toContain(suggestionWithComputedField);
    expect(suggestionAccepted.props().carePlanSuggestions).toContain(suggestionWithScreeningTool);
  });

});
