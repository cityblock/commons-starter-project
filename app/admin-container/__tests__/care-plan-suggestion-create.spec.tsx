import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import CarePlanSuggestionCreate from '../care-plan-suggestion-create';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const goalSuggestionTemplate = {
  id: 'goal-suggestion-template-id',
  title: 'Goal Suggestion Template Title',
  taskTemplates: [{
    id: 'task-template-id',
    title: 'Task Template Title',
    completedWithinNumber: 1,
    completedWithinInterval: 'hour' as any,
    repeating: false,
    goalSuggestionTemplateId: 'goal-suggestion-template-id',
    priority: 'high' as any,
    careTeamAssigneeRole: 'physician' as any,
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    deletedAt: null,
  }],
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
};

const concern = {
  id: 'concern-id',
  title: 'Concern Title',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
};

const answer = {
  id: 'answer-id',
  displayValue: 'answer value',
  value: 'true',
  valueType: 'boolean' as any,
  riskAdjustmentType: 'increment' as any,
  inSummary: true,
  summaryText: 'summary text',
  questionId: 'cool-task-id',
  order: 1,
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  concernSuggestions: [concern],
  goalSuggestions: [goalSuggestionTemplate],
};

it('renders care plan suggestion create component', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <CarePlanSuggestionCreate
            goals={[goalSuggestionTemplate]}
            concerns={[concern]}
            answer={answer} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
