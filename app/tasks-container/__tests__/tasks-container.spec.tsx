import { shallow } from 'enzyme';
import * as React from 'react';
import Tasks, { IProps } from '../../shared/tasks/tasks';
import { taskWithComment } from '../../shared/util/test-data';
import { TasksContainer } from '../tasks-container';

describe('tasks container', () => {
  const location = { search: '' } as any;
  const match = {
    isExact: false,
    params: {
      taskId: taskWithComment.id,
    },
    path: '/tasks',
    url: 'localhost:3000',
  };
  const fetchMoreTasks = jest.fn() as any;
  const history = [] as any;
  const tasks = {
    edges: [{ node: taskWithComment }],
    pageInfo: {
      hasPreviousPage: false,
      hasNextPage: false,
    },
  };
  const wrapper = shallow(
    <TasksContainer
      tasksLoading={false}
      tasksError={null}
      tasksResponse={tasks}
      fetchMoreTasks={fetchMoreTasks}
      location={location}
      match={match}
      history={history}
    />,
  );

  it('renders tasks list', () => {
    expect(wrapper.find('.container').length).toBe(1);
    expect(wrapper.find<IProps>(Tasks).props().taskId).toBe(taskWithComment.id);
  });
});
