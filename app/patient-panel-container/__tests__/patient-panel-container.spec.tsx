import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { currentUser, featureFlags } from '../../shared/util/test-data';
import PatientPanelContainer from '../patient-panel-container';

it('renders patient panel container correctly', () => {
  const mockStore = configureMockStore([]);

  const locale = { messages: ENGLISH_TRANSLATION.messages };
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, currentUser: { currentUser, featureFlags } })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <PatientPanelContainer />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
