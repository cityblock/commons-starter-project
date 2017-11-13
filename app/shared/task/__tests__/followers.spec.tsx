import { shallow } from 'enzyme';
import * as React from 'react';
import { taskWithComment } from '../../util/test-data';
import AddTaskFollower from '../add-task-follower';
import TaskFollowers, { Follower } from '../followers';

describe('Task Followers Component', () => {
  const patientId = 'moana';
  const taskId = 'maui';
  const followers = taskWithComment.followers;

  const wrapper = shallow(
    <TaskFollowers patientId={patientId} taskId={taskId} followers={followers} />,
  );

  it('renders each follower', () => {
    expect(wrapper.find(Follower).length).toBe(1);
  });

  it('renders add task follower component', () => {
    expect(wrapper.find(AddTaskFollower).length).toBe(1);
    expect(wrapper.find(AddTaskFollower).props().patientId).toBe(patientId);
    expect(wrapper.find(AddTaskFollower).props().taskId).toBe(taskId);
    expect(wrapper.find(AddTaskFollower).props().followers).toEqual(followers);
  });
});
