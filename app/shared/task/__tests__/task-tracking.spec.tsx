import { shallow } from 'enzyme';
import React from 'react';
import { Priority } from '../../../graphql/types';
import { taskWithComment } from '../../util/test-data';
import TaskFollowers from '../followers';
import PrioritySelect from '../priority-select';
import TaskTracking from '../task-tracking';

describe('Task Tracking Component', () => {
  const taskId = 'simba';
  const patientId = 'nala';
  const priority = 'high' as Priority;
  const followers = taskWithComment.followers;
  const onPriorityClick = jest.fn();

  const wrapper = shallow(
    <TaskTracking
      taskId={taskId}
      patientId={patientId}
      priority={priority}
      followers={followers}
      onPriorityClick={onPriorityClick}
    />,
  );

  it('renders task priority select', () => {
    expect(wrapper.find(PrioritySelect).length).toBe(1);

    const props = wrapper.find(PrioritySelect).props();

    expect(props.priority).toBe(priority);
    expect(props.onPriorityClick).toBe(onPriorityClick);
  });

  it('renders task followers', () => {
    expect(wrapper.find(TaskFollowers).length).toBe(1);

    const props = wrapper.find(TaskFollowers).props();

    expect(props.taskId).toBe(taskId);
    expect(props.patientId).toBe(patientId);
    expect(props.followers).toEqual(followers);
  });
});
