import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/lib/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import TaskComments, { TaskComments as Component } from '../task-comments';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

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
const comment = {
  id: 'comment-id',
  body: 'body',
  user: user1,
  taskId: 'cool-task-id',
  createdAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
  updatedAt: 'Thu Jul 14 2017 16:52:56 GMT-0400 (EDT)',
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
  comments: [comment],
  createdBy: user1,
  followers: [user1],
};
const tasksResponse = {
  edges: [{
    node: comment,
  }],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

it('correctly renders comments component', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskComments
            taskId={task.id}
            taskCommentsLoading={false}
            taskCommentsError={null}
            taskCommentsResponse={tasksResponse}
            createComment={jest.fn}
            refetchTaskComments={jest.fn}
            updateTaskComments={jest.fn}
            editComment={jest.fn} />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders comments', () => {
  const component = shallow(
    <Component
      taskId={task.id}
      taskCommentsLoading={false}
      taskCommentsError={undefined}
      taskCommentsResponse={tasksResponse}
      createComment={jest.fn() as any}
      refetchTaskComments={jest.fn() as any}
      updateTaskComments={jest.fn() as any}
      editComment={jest.fn() as any} />);
  const instance = component.instance() as Component;
  instance.setState({
    comments: [comment],
    commentBody: '',
    createCommentError: undefined,
  });
  expect(instance.renderComments()).toMatchSnapshot();
});
