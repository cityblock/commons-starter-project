import { shallow } from 'enzyme';
import * as React from 'react';
import { taskWithComment } from '../../util/test-data';
import AddTaskFollower from '../add-task-follower';
import Follower from '../follower';
import TaskFollowers, { IProps } from '../followers';

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
    expect(wrapper.find<IProps>(AddTaskFollower as any).props().patientId).toBe(patientId);
    expect(wrapper.find<IProps>(AddTaskFollower as any).props().taskId).toBe(taskId);
    expect(wrapper.find<IProps>(AddTaskFollower as any).props().followers).toEqual(followers);
  });
});
