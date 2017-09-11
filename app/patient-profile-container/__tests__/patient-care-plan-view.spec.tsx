import { createMemoryHistory } from 'history';
import * as React from 'react';
import { gql } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientCarePlanView from '../patient-care-plan-view';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const query = gql(`
query getPatientCarePlan($patientId: String!) {
  carePlanForPatient(patientId: $patientId) {
    concerns {
      ...FullPatientConcern
      __typename
    }
    goals {
      ...FullPatientGoal
      __typename
    }
    __typename
  }
}

fragment FullPatientConcern on PatientConcern {
  id
  order
  concernId
  concern {
    ...FullConcern
    __typename
  }
  patientId
  patient {
    ...ShortPatient
    __typename
  }
  patientGoals {
    ...FullPatientGoal
    __typename
  }
  startedAt
  completedAt
  createdAt
  updatedAt
  deletedAt
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

fragment FullPatientGoal on PatientGoal {
  id
  title
  patientId
  patient {
    ...ShortPatient
    __typename
  }
  patientConcernId
  goalSuggestionTemplateId
  goalSuggestionTemplate {
    ...FullGoalSuggestionTemplate
    __typename
  }
  tasks {
    ...FullTask
    __typename
  }
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

fragment FullTask on Task {
  id
  title
  description
  createdAt
  updatedAt
  completedAt
  deletedAt
  dueAt
  patientId
  priority
  patient {
    id
    firstName
    middleName
    lastName
    __typename
  }
  assignedTo {
    id
    firstName
    lastName
    googleProfileImageUrl
    userRole
    __typename
  }
  followers {
    id
    firstName
    lastName
    googleProfileImageUrl
    userRole
    __typename
  }
  createdBy {
    id
    firstName
    lastName
    googleProfileImageUrl
    userRole
    __typename
  }
  patientGoal {
    id
    title
    __typename
  }
  __typename
}`);

it('renders patient care plan view', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[{
      request: {
        query,
        variables: {
          patientId: 'patient-1',
        },
      },
      result: {
        data: {
          patientCarePlan: {},
        },
      },
    }]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientCarePlanView
            patientId={'patient-1'}
            subTabId={'active'}
            loading={false}
            routeBase={'/patients/patient-1/carePlan'} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
