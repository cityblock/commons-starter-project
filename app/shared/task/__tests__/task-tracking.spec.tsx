import { shallow } from 'enzyme';
import * as React from 'react';
import { taskWithComment } from '../../util/test-data';
import TaskFollowers from '../followers';
import PrioritySelect from '../priority-select';
import TaskTracking from '../task-tracking';

describe('Task Tracking Component', () => {
  const taskId = 'simba';
  const patientId = 'nala';
  const priority = 'high';
  const followers = taskWithComment.followers;
  const editTask = () => true as any;

  const wrapper = shallow(
    <TaskTracking
      taskId={taskId}
      patientId={patientId}
      priority={priority}
      followers={followers}
      editTask={editTask}
    />,
  );

  it('renders task priority select', () => {
    expect(wrapper.find(PrioritySelect).length).toBe(1);

    const props = wrapper.find(PrioritySelect).props();

    expect(props.taskId).toBe(taskId);
    expect(props.priority).toBe(priority);
    expect(props.editTask).toBe(editTask);
  });

  it('renders task followers', () => {
    expect(wrapper.find(TaskFollowers).length).toBe(1);

    const props = wrapper.find(TaskFollowers).props();

    expect(props.taskId).toBe(taskId);
    expect(props.patientId).toBe(patientId);
    expect(props.followers).toEqual(followers);
  });
});
