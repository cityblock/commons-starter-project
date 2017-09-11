import { createMemoryHistory } from 'history';
import * as React from 'react';
import { gql } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { completedTask, patient } from '../../shared/util/test-data';
import PatientTasks from '../patient-tasks';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

/* tslint:disable:max-line-length */
const query = gql(`
query getPatientTasks($patientId: String!, $pageNumber: Int, $pageSize: Int, $orderBy: TaskOrderOptions) {
  tasksForPatient(patientId: $patientId, pageNumber: $pageNumber, pageSize: $pageSize, orderBy: $orderBy) {
    edges {
      node {
        ...FullTask
        __typename
      }
      __typename
    }
    pageInfo {
      hasPreviousPage
      hasNextPage
      __typename
    }
    __typename
  }
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
/* tslint:enable:max-line-length */

it('renders patient tasks', () => {
  const tasksResponse = {
    edges: [{ node: completedTask }],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: true,
    },
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider
      mocks={[
        {
          request: {
            query,
            variables: {
              patientId: patient.id,
              pageNumber: 0,
              pageSize: 10,
              orderBy: 'createdAtDesc',
            },
          },
          result: {
            data: {
              tasksForPatient: {
                edges: [],
                pageInfo: {
                  hasNextPage: false,
                  hasPreviousPage: false,
                  __typename: 'PageInfo',
                },
              },
            },
          },
        },
      ]}
      store={mockStore({ locale, task: completedTask })}
    >
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientTasks
            updatePageParams={() => false}
            refetchTasks={() => false}
            tasksResponse={tasksResponse}
            patientId={patient.id}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
