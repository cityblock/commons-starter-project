import { shallow } from 'enzyme';
import React from 'react';
import TaskCompletion from '../task-completion';
import TaskDue, { IProps } from '../task-due';
import TaskProgress from '../task-progress';

describe('Task Progress Component - Due Date and Completion Toggle', () => {
  const dueAt = '2017-11-10 17:33:51.972-05';
  const completedAt = '';
  const editTask = jest.fn();
  const taskId = 'common';

  const wrapper = shallow(
    <TaskProgress dueAt={dueAt} completedAt={completedAt} editTask={editTask} taskId={taskId} />,
  );

  it('renders the task due component with correct props', () => {
    expect(wrapper.find(TaskDue).length).toBe(1);
    expect(wrapper.find(TaskDue).props().taskId).toBe(taskId);
    expect(wrapper.find(TaskDue).props().dueAt).toBe(dueAt);
    expect(wrapper.find(TaskDue).props().completedAt).toBe(completedAt);
    expect(wrapper.find(TaskDue).props().editTask).toBe(editTask);
  });

  it('renders the task completion toggle with correct props', () => {
    expect(wrapper.find<IProps>(TaskDue as any).length).toBe(1);
    expect(wrapper.find<IProps>(TaskCompletion).props().taskId).toBe(taskId);
    expect(wrapper.find<IProps>(TaskCompletion).props().completedAt).toBe(completedAt);
  });
});
