import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import PatientTasks from '../patient-tasks';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('renders patient tasks', () => {
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
  const task = {
    title: 'title',
    description: 'description',
    patientId: patient.id,
    createdById: user.id,
    assignedToId: user.id,
    completedById: user.id,
  };
  const tasksResponse = {
    edges: [
      { node: task },
    ],
    pageInfo: {
      hasNextPage: true,
      hasPreviousPage: true,
    },
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <PatientTasks
            updatePageParams={() => false}
            refetchTasks={() => false}
            tasksResponse={tasksResponse}
            patientId={patient.id} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});
