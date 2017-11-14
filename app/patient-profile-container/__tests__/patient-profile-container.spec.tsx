import { createMemoryHistory } from 'history';
import * as React from 'react';
import { gql } from 'react-apollo';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientProfileContainer, { SelectableTabs } from '../patient-profile-container';

export const patientCarePlanQuery = gql(`
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
}`);

const mockStore = configureMockStore([]);
const task = { taskId: 'foo' };
const locale = { messages: ENGLISH_TRANSLATION.messages };
const oldDate = Date.now;
const match = {
  params: {
    patientId: 'patient-1',
    tabId: 'map' as SelectableTabs,
  },
};

describe('patient profile container', () => {
  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders patient profile container correctly', () => {
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider
        mocks={[
          {
            request: {
              query: patientCarePlanQuery,
              variables: {
                patientId: 'patient-1',
              },
            },
            result: {
              data: {
                patientCarePlan: {},
              },
            },
          },
        ]}
        store={mockStore({ locale, task })}
      >
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientProfileContainer match={match} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders patient profile for ipad', () => {
    const history = createMemoryHistory();
    const browser = { size: 'small' };
    const tree = create(
      <MockedProvider
        mocks={[
          {
            request: {
              query: patientCarePlanQuery,
              variables: {
                patientId: 'patient-1',
              },
            },
            result: {
              data: {
                patientCarePlan: {},
              },
            },
          },
        ]}
        store={mockStore({ locale, browser, task })}
      >
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientProfileContainer match={match} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
