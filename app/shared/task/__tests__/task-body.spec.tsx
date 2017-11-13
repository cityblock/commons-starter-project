import { shallow } from 'enzyme';
import * as React from 'react';
import TaskBody from '../task-body';
import TaskInfo from '../task-info';

describe('Task Body Component', () => {
  const taskId = 'magikarp';
  const title = 'Evolve into Gyrados';
  const description = 'Splash sucks :(';
  const goal = 'Become stronger';
  const editTask = () => true as any;

  const wrapper = shallow(
    <TaskBody
      taskId={taskId}
      title={title}
      description={description}
      goal={goal}
      editTask={editTask}
    />,
  );

  it('renders task information component', () => {
    expect(wrapper.find(TaskInfo).length).toBe(1);

    expect(wrapper.find(TaskInfo).props().taskId).toBe(taskId);
    expect(wrapper.find(TaskInfo).props().title).toBe(title);
    expect(wrapper.find(TaskInfo).props().description).toBe(description);
  });

  it('renders information about the goal', () => {
    expect(wrapper.find('h3').length).toBe(4);

    expect(
      wrapper
        .find('h3')
        .at(2)
        .text(),
    ).toBe('Goal:');
    expect(
      wrapper
        .find('h3')
        .at(3)
        .text(),
    ).toBe(goal);
  });
});
