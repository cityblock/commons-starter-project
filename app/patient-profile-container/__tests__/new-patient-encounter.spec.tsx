import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import NewPatientEncounter from '../new-patient-encounter';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders encounter creation', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <NewPatientEncounter patientId={''} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
