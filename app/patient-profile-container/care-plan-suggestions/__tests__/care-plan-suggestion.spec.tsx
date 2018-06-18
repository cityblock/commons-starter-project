import { shallow } from 'enzyme';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import DateInfo from '../../../shared/library/date-info/date-info';
import Icon from '../../../shared/library/icon/icon';
import TextInfo from '../../../shared/library/text-info/text-info';
import {
  fullCarePlanSuggestionWithConcern as suggestion,
  fullCarePlanSuggestionWithGoal as goalSuggestion,
} from '../../../shared/util/test-data';
import CarePlanSuggestion from '../care-plan-suggestion';
import SuggestionSource from '../suggestion-source';

describe('Care Plan Suggestion Component', () => {
  const placeholderFn = jest.fn();

  const wrapper = shallow(
    <CarePlanSuggestion
      suggestion={suggestion}
      onAccept={placeholderFn}
      onDismiss={placeholderFn}
    />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders formatted message for suggestion title', () => {
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.concern');
  });

  it('renders suggestion source pill', () => {
    expect(wrapper.find(SuggestionSource).props().suggestion).toEqual(suggestion);
  });

  it('renders associated concern title', () => {
    expect(wrapper.find('h1').text()).toBe(suggestion.concern.title);
  });

  it('renders date info for when suggestion was created', () => {
    expect(wrapper.find(DateInfo).props().label).toBe('suggested');
    expect(wrapper.find(DateInfo).props().date).toBe(suggestion.createdAt);
  });

  it('does not render text info if concern suggestion', () => {
    expect(wrapper.find(TextInfo).length).toBe(0);
  });

  it('renders icon to dismiss suggestion', () => {
    expect(wrapper.find(Icon).length).toBe(2);

    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().name,
    ).toBe('close');
    expect(
      wrapper
        .find(Icon)
        .at(0)
        .props().color,
    ).toBe('red');
  });

  it('renders icon to accept suggestion', () => {
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().name,
    ).toBe('check');
    expect(
      wrapper
        .find(Icon)
        .at(1)
        .props().color,
    ).toBe('green');
  });

  it('renders goal title if goal suggestion', () => {
    wrapper.setProps({ suggestion: goalSuggestion });

    expect(wrapper.find('h1').text()).toBe(goalSuggestion.goalSuggestionTemplate.title);
    expect(wrapper.find(FormattedMessage).props().id).toBe('carePlanSuggestion.goal');
  });

  it('applies goal styles if goal suggestion', () => {
    expect(wrapper.find('.container').props().className).toBe('container goal');
  });

  it('renders count of tasks if goal suggestion', () => {
    expect(wrapper.find(TextInfo).props().messageId).toBe('carePlanSuggestion.tasks');
    expect(wrapper.find(TextInfo).props().text).toBe(1);
  });

  it('hides buttons if specified', () => {
    wrapper.setProps({ hideButtons: true });

    expect(wrapper.find(Icon).length).toBe(0);
  });
});
