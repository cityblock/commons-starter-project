import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../redux-connected-intl-provider';
import { TaskRow } from '../task-row';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);
const oldDate = Date.now;

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
  id: 'cool-task-id',
  createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
  deletedAt: null,
  completedAt: null,
  priority: 'low',
  title: 'title',
  description: 'description',
  patient,
  assignedTo: user,
  followers: [user],
  patientId: patient.id,
  createdById: user.id,
  createdBy: user,
  assignedToId: user.id,
  completedById: user.id,
};

describe('task row', () => {

  beforeAll(() => { Date.now = jest.fn(() => 1500494779252); });
  afterAll(() => { Date.now = oldDate; });

  it('renders task row', () => {
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <TaskRow
              task={task}
              selected={true}
              routeBase={'/foo/bar'} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders task row with multiple followers', () => {
    const user2 = {
      id: 'id2',
      locale: 'en',
      firstName: 'first2',
      lastName: 'last2',
      userRole: 'physician' as any,
      email: 'b@c.com',
      homeClinicId: '1',
      googleProfileImageUrl: null,
    };
    task.followers = [user, user2];
    const history = createMemoryHistory();
    const tree = create(
      <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
        <ReduxConnectedIntlProvider>
          <ConnectedRouter history={history}>
            <TaskRow
              task={task}
              selected={true}
              routeBase={'/foo/bar'} />
          </ConnectedRouter>
        </ReduxConnectedIntlProvider>
      </MockedProvider>,
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
