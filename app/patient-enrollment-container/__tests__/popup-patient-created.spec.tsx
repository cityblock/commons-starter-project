import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PopupPatientCreated from '../popup-patient-created';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders popup', () => {
  const patient = {
    id: 'unique-id',
    firstName: 'first',
    middleName: 'middle',
    lastName: 'last',
    language: null,
    gender: null,
    dateOfBirth: null,
    zip: null,
    createdAt: '2017-09-07T13:45:14.532Z',
    consentToText: false,
    consentToCall: false,
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PopupPatientCreated
            patient={patient}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
