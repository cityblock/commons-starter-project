import { shallow } from 'enzyme';
import { createMemoryHistory } from 'history';
import * as React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { ConnectedRouter } from 'react-router-redux';
import { create } from 'react-test-renderer';
import configureMockStore from 'redux-mock-store';
import { ENGLISH_TRANSLATION } from '../../../reducers/messages/en';
import ReduxConnectedIntlProvider from '../../../redux-connected-intl-provider';
import { comment, taskWithComment } from '../../util/test-data';
import TaskComments, { TaskComments as Component } from '../task-comments';

const locale = { messages: ENGLISH_TRANSLATION.messages };
const mockStore = configureMockStore([]);

const tasksResponse = {
  edges: [
    {
      node: comment,
    },
  ],
  pageInfo: {
    hasNextPage: false,
    hasPreviousPage: false,
  },
};

it('correctly renders comments component', () => {
  const history = createMemoryHistory();
  const tree = create(
    <MockedProvider mocks={[]} store={mockStore({ locale, task: taskWithComment })}>
      <ReduxConnectedIntlProvider>
        <ConnectedRouter history={history}>
          <TaskComments
            taskId={taskWithComment.id}
            taskCommentsLoading={false}
            taskCommentsError={null}
            taskCommentsResponse={tasksResponse}
            createComment={jest.fn}
            refetchTaskComments={jest.fn}
            updateTaskComments={jest.fn}
            editComment={jest.fn}
          />
        </ConnectedRouter>
      </ReduxConnectedIntlProvider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders comments', () => {
  const component = shallow(
    <Component
      taskId={taskWithComment.id}
      taskCommentsLoading={false}
      taskCommentsError={undefined}
      taskCommentsResponse={tasksResponse}
      createComment={jest.fn() as any}
      refetchTaskComments={jest.fn() as any}
      updateTaskComments={jest.fn() as any}
      editComment={jest.fn() as any}
    />,
  );
  const instance = component.instance() as Component;
  instance.setState({
    comments: [comment],
    commentBody: '',
    createCommentError: undefined,
  });
  expect(instance.renderComments()).toMatchSnapshot();
});
