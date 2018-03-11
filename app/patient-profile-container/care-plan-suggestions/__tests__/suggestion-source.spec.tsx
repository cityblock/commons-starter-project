import { shallow } from 'enzyme';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  computedField,
  fullCarePlanSuggestionWithConcern as suggestion,
  patientScreeningToolSubmission,
  screeningTool,
} from '../../../shared/util/test-data';
import SuggestionSource from '../suggestion-source';

describe('Care Plan Suggestion Source Component', () => {
  const wrapper = shallow(<SuggestionSource suggestion={suggestion} />);

  it('renders container', () => {
    expect(wrapper.find('div').props().className).toBe('container');
  });

  it('renders formatted message with correct id', () => {
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.domainAssessment');
  });

  it('handles suggestions from screening tool', () => {
    const newSuggestion = {
      ...suggestion,
      patientScreeningToolSubmission: {
        ...patientScreeningToolSubmission,
        screeningTool,
      },
    };

    wrapper.setProps({ suggestion: newSuggestion });

    expect(wrapper.find('div').props().className).toBe('container lightBlueBorder');
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.tool');
  });

  it('handles suggestions from computed field', () => {
    wrapper.setProps({ suggestion: { ...suggestion, computedField } });

    expect(wrapper.find('div').props().className).toBe('container blackBorder');
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.computedField');
  });
});