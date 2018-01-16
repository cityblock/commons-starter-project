import { shallow } from 'enzyme';
import * as React from 'react';
import {
  answer,
  concern,
  goalSuggestionTemplate,
  screeningToolScoreRange,
} from '../../shared/util/test-data';
import { CarePlanSuggestionCreate as Component } from '../care-plan-suggestion-create';

it('renders the correct concern suggestion options', () => {
  const newConcern = {
    id: 'new-concern-id',
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
    title: 'New Concern Title',
    diagnosisCodes: [],
  };

  answer.concernSuggestions = [concern] as any;
  const component = shallow(
    <Component
      goals={null}
      concerns={[concern, newConcern]}
      answer={answer}
      screeningToolScoreRange={null}
    />,
  );
  const instance = component.instance() as Component;
  const concernOptions = instance.getConcernOptions();
  expect(concernOptions.length).toEqual(1);
  expect(concernOptions[0].key).toEqual(newConcern.id);
});

it('renders the correct goal suggestion options', () => {
  const newGoalSuggestionTemplate = {
    id: 'new-goal-suggestion-template-id',
    title: 'Goal Suggestion Template Title',
    taskTemplates: [],
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
  };

  screeningToolScoreRange.goalSuggestions = [goalSuggestionTemplate] as any;
  const component = shallow(
    <Component
      goals={[goalSuggestionTemplate, newGoalSuggestionTemplate]}
      concerns={null}
      answer={null}
      screeningToolScoreRange={screeningToolScoreRange}
    />,
  );
  const instance = component.instance() as Component;
  const goalOptions = instance.getGoalOptions();
  expect(goalOptions.length).toEqual(1);
  expect(goalOptions[0].key).toEqual(newGoalSuggestionTemplate.id);
});
