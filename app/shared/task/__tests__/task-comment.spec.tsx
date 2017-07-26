import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import TaskComment, { TaskComment as Comment } from '../task-comment';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

it('correctly renders a comment as editable or not', () => {
  const user1 = {
    id: 'id1',
    locale: 'en',
    firstName: 'first',
    lastName: 'last',
    userRole: 'physician' as any,
    email: 'a@b.com',
    homeClinicId: '1',
    googleProfileImageUrl: null,
  };
  const user2 = {
    id: 'id2',
    locale: 'en',
    firstName: 'first',
    lastName: 'last',
    userRole: 'physician' as any,
    email: 'b@c.com',
    homeClinicId: '1',
    googleProfileImageUrl: null,
  };
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
  const task = {
    id: 'cool-task-id',
    updatedAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    createdAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    dueAt: 'Thu Jul 13 2017 16:52:56 GMT-0400 (EDT)',
    title: 'title',
    description: 'description',
    patient,
    patientId: patient.id,
    assignedTo: user1,
    createdBy: user1,
    followers: [user1],
  };
  const comment = {
    id: 'comment-id',
    body: 'body',
    user: user1,
    taskId: task.id,
    createdAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
    updatedAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
  };
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskComment
            comment={comment}
            currentUser={user1}
            onEdit={() => (true)} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();

  const editable = new Comment({
    comment,
    currentUser: user1,
    onEdit: () => (true),
  });
  const nonEditable = new Comment({
    comment,
    currentUser: user2,
    onEdit: () => (true),
  });

  expect(editable.isEditable()).toEqual(true);
  expect(nonEditable.isEditable()).toEqual(false);
});
