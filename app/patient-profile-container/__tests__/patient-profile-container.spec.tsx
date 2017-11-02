import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientProfileContainer from '../patient-profile-container';
import { patientCarePlanQuery } from './patient-care-plan-view.spec';

const mockStore = configureMockStore([]);
const locale = { messages: ENGLISH_TRANSLATION.messages };
const match = {
  params: {
    patientId: 'patient-1',
    tabId: 'map',
  },
};

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
      store={mockStore({ locale })}
    >
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientProfileContainer patientId={'patient-id'} match={match} />
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
      store={mockStore({ locale, browser })}
    >
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientProfileContainer browserSize={'small'} patientId={'patient-1'} match={match} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
