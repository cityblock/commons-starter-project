import { createMemoryHistory } from 'history';
import * as React from 'react';
import { gql } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import {
  carePlanSuggestionWithConcern,
  carePlanSuggestionWithGoal,
} from '../../shared/util/test-data';
import PatientCarePlanSuggestions from '../patient-care-plan-suggestions';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const carePlanSuggestions = [carePlanSuggestionWithConcern, carePlanSuggestionWithGoal];

const query = gql(`
query getPatientCarePlanSuggestions($patientId: String!) {
  carePlanSuggestionsForPatient(patientId: $patientId) {
    ...FullCarePlanSuggestion
    __typename
  }
}

fragment FullCarePlanSuggestion on CarePlanSuggestion {
  id
  patientId
  patient {
    ...ShortPatient
    __typename
  }
  suggestionType
  concernId
  concern {
    ...FullConcern
    __typename
  }
  goalSuggestionTemplateId
  goalSuggestionTemplate {
    ...FullGoalSuggestionTemplate
    __typename
  }
  acceptedById
  acceptedBy {
    ...ShortUser
    __typename
  }
  dismissedById
  dismissedBy {
    ...ShortUser
    __typename
  }
  dismissedReason
  createdAt
  updatedAt
  dismissedAt
  acceptedAt
  patientScreeningToolSubmissionId
  __typename
}

fragment FullConcern on Concern {
  id
  title
  createdAt
  updatedAt
  deletedAt
  __typename
}

fragment FullGoalSuggestionTemplate on GoalSuggestionTemplate {
  id
  title
  taskTemplates {
    ...FullTaskTemplate
    __typename
  }
  createdAt
  updatedAt
  deletedAt
  __typename
}

fragment FullTaskTemplate on TaskTemplate {
  id
  title
  completedWithinNumber
  completedWithinInterval
  repeating
  goalSuggestionTemplateId
  priority
  careTeamAssigneeRole
  createdAt
  updatedAt
  deletedAt
  __typename
}

fragment ShortPatient on Patient {
  id
  firstName
  middleName
  lastName
  language
  gender
  dateOfBirth
  zip
  createdAt
  consentToText
  consentToCall
  __typename
}

fragment ShortUser on User {
  id
  firstName
  lastName
  userRole
  googleProfileImageUrl
  __typename
}`);

it('renders patient care plan suggestions', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider
      mocks={[
        {
          request: {
            query,
            variables: { patientId: 'patient-1' },
          },
          result: { data: { carePlanSuggestionsForPatient: [] } },
        },
      ]}
      store={mockStore({ locale })}
    >
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientCarePlanSuggestions
            patientId={'patient-1'}
            carePlanSuggestions={carePlanSuggestions}
            routeBase={'/patients/patient-1/carePlan'}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
