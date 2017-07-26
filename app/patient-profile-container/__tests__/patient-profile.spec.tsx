import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientProfile from '../patient-profile-container';

it('renders patient profile container correctly', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Route component={PatientProfile as any} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders patient profile for ipad', () => {
  const mockStore = configureMockStore([]);
  const history = createMemoryHistory();
  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const browser = { size: 'small' };
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, browser })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <Route component={PatientProfile as any} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
