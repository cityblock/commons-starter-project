import { shallow } from 'enzyme';

import React from 'react';
import { MockedProvider } from 'react-apollo/test-utils';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
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
  const tree = create(
    <MockedProvider mocks={[]}>
      <Provider store={mockStore({ locale, task: taskWithComment })}>
        <ReduxConnectedIntlProvider>
          <BrowserRouter>
            <TaskComments taskId={taskWithComment.id} />
          </BrowserRouter>
        </ReduxConnectedIntlProvider>
      </Provider>
    </MockedProvider>,
  ).toJSON();
  expect(tree).toMatchSnapshot();
});

it('renders comments', () => {
  const component = shallow(
    <Component
      taskId={taskWithComment.id}
      taskCommentsLoading={false}
      taskCommentsError={null}
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
  });
  expect(instance.renderComments()).toMatchSnapshot();
});
