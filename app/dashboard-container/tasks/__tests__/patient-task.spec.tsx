import { shallow } from 'enzyme';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { getMapTaskRoute } from '../../../shared/helpers/route-helpers';
import Avatar from '../../../shared/library/avatar/avatar';
import DateInfo from '../../../shared/library/date-info/date-info';
import { task as rawTask, user } from '../../../shared/util/test-data';
import PatientTask from '../patient-task';
import TaskNotifications from '../task-notifications';

describe('Dashboard Patient Task Component', () => {
  const task = {
    ...rawTask,
    followers: [user],
  };

  const wrapper = shallow(<PatientTask task={task} withNotifications={false} />);

  it('renders link to task in MAP', () => {
    expect(wrapper.find(Link).length).toBe(1);
    expect(wrapper.find(Link).props().to).toBe(getMapTaskRoute(task.patientId, task.id));
  });

  it('applies correct styles to container', () => {
    expect(wrapper.find(Link).props().className).toBe('link redBorder');
  });

  it('renders task title', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('h2').text()).toBe(task.title);
  });

  it('renders followers container', () => {
    expect(wrapper.find('.followers').length).toBe(1);
  });

  it('renders an avatar for each follower', () => {
    expect(wrapper.find(Avatar).length).toBe(1);
    expect(wrapper.find(Avatar).props().src).toBe(user.googleProfileImageUrl);
    expect(wrapper.find(Avatar).props().size).toBe('small');
    expect(wrapper.find(Avatar).props().className).toBe('avatar');
  });

  it('renders due date for task', () => {
    expect(wrapper.find(DateInfo).length).toBe(1);
    expect(wrapper.find(DateInfo).props().label).toBe('due');
    expect(wrapper.find(DateInfo).props().units).toBe('day');
    expect(wrapper.find(DateInfo).props().highlightDueSoon).toBeTruthy();
  });

  it('does not render notifications for tasks without notifications', () => {
    expect(wrapper.find(TaskNotifications).length).toBe(0);
  });

  it('renders task notifications component if with notifications', () => {
    wrapper.setProps({ withNotifications: true });

    expect(wrapper.find(TaskNotifications).length).toBe(1);
    expect(wrapper.find(TaskNotifications).props().taskId).toBe(task.id);
  });
});
