import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import {
  answer,
  answerWithConcernAndGoal,
  concern,
  goalSuggestionTemplate,
  screeningToolScoreRange,
} from '../../shared/util/test-data';
import CarePlanSuggestionCreate, {
  CarePlanSuggestionCreate as Component,
} from '../care-plan-suggestion-create';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders care plan suggestion create component', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <CarePlanSuggestionCreate
            goals={[goalSuggestionTemplate]}
            concerns={[concern]}
            answer={answerWithConcernAndGoal}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders the correct concern suggestion options', () => {
  const newConcern = {
    id: 'new-concern-id',
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
    title: 'New Concern Title',
  };

  answer.concernSuggestions = [concern] as any;
  const component = shallow(
    <Component
      goals={undefined}
      concerns={[concern, newConcern]}
      answer={answer}
      screeningToolScoreRange={undefined} />,
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
      concerns={undefined}
      answer={undefined}
      screeningToolScoreRange={screeningToolScoreRange} />,
  );
  const instance = component.instance() as Component;
  const goalOptions = instance.getGoalOptions();
  expect(goalOptions.length).toEqual(1);
  expect(goalOptions[0].key).toEqual(newGoalSuggestionTemplate.id);
});
