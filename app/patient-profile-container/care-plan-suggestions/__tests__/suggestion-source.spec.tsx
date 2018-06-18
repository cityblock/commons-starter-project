import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import {
  computedField,
  fullCarePlanSuggestionWithConcern as suggestion,
  riskArea,
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
      screeningTool: {
        title: screeningTool.title,
        id: screeningTool.id,
      },
    };

    wrapper.setProps({ suggestion: newSuggestion });

    expect(wrapper.find('div').props().className).toBe('container lightBlueBorder');
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.tool');
  });

  it('handles suggestions from computed field', () => {
    wrapper.setProps({
      suggestion: {
        ...suggestion,
        computedField: {
          id: computedField.id,
          label: computedField.label,
          riskArea: {
            id: riskArea.id,
            title: riskArea.title,
          },
        },
      },
    });

    expect(wrapper.find('div').props().className).toBe('container blackBorder');
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.computedField');
  });
});
