import { shallow } from 'enzyme';
import * as React from 'react';
import PatientTaskCount from '../patient-task-count';
import TaskCountItem from '../task-count-item';

describe('Dashboard Patient Task Count', () => {
  const tasksDueCount = 11;
  const notificationsCount = 12;

  const wrapper = shallow(
    <PatientTaskCount tasksDueCount={tasksDueCount} notificationsCount={notificationsCount} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders count of tasks due', () => {
    expect(wrapper.find(TaskCountItem).length).toBe(2);
    expect(
      wrapper
        .find(TaskCountItem)
        .at(0)
        .props().messageId,
    ).toBe('dashboard.tasksDue');
    expect(
      wrapper
        .find(TaskCountItem)
        .at(0)
        .props().count,
    ).toBe(tasksDueCount);
  });

  it('renders count of tasks with notifications', () => {
    expect(
      wrapper
        .find(TaskCountItem)
        .at(1)
        .props().messageId,
    ).toBe('dashboard.notifications');
    expect(
      wrapper
        .find(TaskCountItem)
        .at(1)
        .props().count,
    ).toBe(notificationsCount);
  });
});
