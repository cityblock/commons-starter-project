import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PopupPatientCarePlanSuggestionAccepted from '../popup-patient-care-plan-suggestion-accepted';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const carePlanConcernSuggestion = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient: {
    id: 'patient-id',
    firstName: 'Bob',
    middleName: null,
    lastName: 'Smith',
    language: 'en',
    gender: 'male',
    dateOfBirth: '01/01/1995',
    zip: 10001,
    createdAt: '2017-08-16T19:27:36.378Z',
    consentToCall: true,
    consentToText: true,
  },
  suggestionType: 'concern' as any,
  concernId: 'concern-id',
  concern: {
    id: 'concern-id',
    title: 'Concern Title',
    createdAt: '2017-08-16T19:27:36.378Z',
    updatedAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
  },
  goalSuggestionTemplateId: null,
  goalSuggestionTemplate: null,
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
};

const carePlanGoalSuggestion = {
  id: 'care-plan-suggestion-id',
  patientId: 'patient-id',
  patient: {
    id: 'patient-id',
    firstName: 'Bob',
    middleName: null,
    lastName: 'Smith',
    language: 'en',
    gender: 'male',
    dateOfBirth: '01/01/1995',
    zip: 10001,
    createdAt: '2017-08-16T19:27:36.378Z',
    consentToCall: true,
    consentToText: true,
  },
  suggestionType: 'concern' as any,
  concernId: 'concern-id',
  concern: null,
  goalSuggestionTemplateId: 'goal-suggestion-template-id',
  goalSuggestionTemplate: {
    id: 'goal-suggestion-template-id',
    title: 'Goal Title',
    taskTemplates: [{
      id: 'task-template-1',
      title: 'Task Title',
      priority: 'high' as any,
      completedWithinNumber: 1,
      completedWithinInterval: 'week' as any,
      repeating: false,
      goalSuggestionTemplateId: 'goal-suggestion-template-1',
      careTeamAssigneeRole: 'physician' as any,
      createdAt: '2017-08-16T19:27:36.378Z',
      updatedAt: '2017-08-16T19:27:36.378Z',
      deletedAt: null,
    }],
    createdAt: '2017-08-16T19:27:36.378Z',
    updatedAt: '2017-08-16T19:27:36.378Z',
    deletedAt: null,
  },
  acceptedById: null,
  acceptedBy: null,
  dismissedById: null,
  dismissedBy: null,
  dismissedReason: null,
  dismissedAt: null,
  acceptedAt: null,
  createdAt: '2017-08-16T19:27:36.378Z',
  updatedAt: '2017-08-16T19:27:36.378Z',
};

it('renders popup for concern suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCarePlanSuggestionAccepted
            visible={true}
            suggestion={carePlanConcernSuggestion}
            patientId={'patient-id'}
            suggestionType={'concern'}
            onDismiss={() => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders popup for goal suggestion', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCarePlanSuggestionAccepted
            patientId={'patient-id'}
            visible={true}
            suggestion={carePlanGoalSuggestion}
            suggestionType={'goal'}
            onDismiss={() => true} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
