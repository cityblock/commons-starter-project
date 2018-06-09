import { shallow } from 'enzyme';
import * as React from 'react';
import { TaskCompletion } from '../task-completion';

describe('Task Complete Toggle Button', () => {
  const taskId = 'padmaLakshmi';
  const completeTask = jest.fn();
  const uncompleteTask = jest.fn();

  it('renders a button if not complete', () => {
    const completedAt = '';

    const wrapper = shallow(
      <TaskCompletion
        taskId={taskId}
        completedAt={completedAt}
        uncompleteTask={uncompleteTask}
        completeTask={completeTask}
      />,
    );

    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('p').text()).toBe('Mark Complete');
  });

  it('renders a button if not complete', () => {
    const completedAt = '2017-11-10 17:33:51.972-05';

    const wrapper = shallow(
      <TaskCompletion
        taskId={taskId}
        completedAt={completedAt}
        uncompleteTask={uncompleteTask}
        completeTask={completeTask}
      />,
    );

    expect(wrapper.find('button').length).toBe(1);
    expect(wrapper.find('p').text()).toBe('Task Complete');
  });
});
