import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import TaskCreate from '../task-create';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders task create', () => {
  const patient = {
    id: 'unique-id',
    firstName: 'first',
    middleName: 'middle',
    lastName: 'last',
    language: null,
    gender: null,
    dateOfBirth: null,
    zip: null,
    createdAt: null,
    consentToText: false,
    consentToCall: false,
  };
  const user = {
    id: 'id',
    locale: 'en',
    firstName: 'first',
    lastName: 'last',
    userRole: 'physician' as any,
    email: 'a@b.com',
    homeClinicId: '1',
    googleProfileImageUrl: null,
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskCreate
            patient={patient}
            careTeam={[user]}
            onClose={() => false} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
