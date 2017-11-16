import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { patient } from '../../shared/util/test-data';
import PatientInfo from '../patient-info';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders patient info', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <PatientInfo patientId={patient.id} patient={patient} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
