import { shallow } from 'enzyme';
import * as React from 'react';
import { task } from '../../../shared/util/test-data';
import PatientTaskList from '../patient-task-list';
import PatientTasks from '../patient-tasks';

describe('Dashboard Patient Tasks Component', () => {
  const wrapper = shallow(<PatientTasks tasksDueSoon={[]} tasksWithNotifications={[]} />);

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('does not render a list of tasks if none present', () => {
    expect(wrapper.find(PatientTaskList).length).toBe(0);
  });

  it('renders a list for tasks due soon', () => {
    wrapper.setProps({ tasksDueSoon: [task] });

    expect(wrapper.find(PatientTaskList).length).toBe(1);
    expect(wrapper.find(PatientTaskList).props().messageId).toBe('dashboard.tasksDue');
    expect(wrapper.find(PatientTaskList).props().tasks).toEqual([task]);
    expect(wrapper.find(PatientTaskList).props().withNotifications).toBeFalsy();
  });

  it('renders a list for tasks with notificaitons', () => {
    wrapper.setProps({ tasksWithNotifications: [task] });

    expect(wrapper.find(PatientTaskList).length).toBe(2);
    expect(
      wrapper
        .find(PatientTaskList)
        .at(1)
        .props().messageId,
    ).toBe('dashboard.notifications');
    expect(
      wrapper
        .find(PatientTaskList)
        .at(1)
        .props().tasks,
    ).toEqual([task]);
    expect(
      wrapper
        .find(PatientTaskList)
        .at(1)
        .props().withNotifications,
    ).toBeTruthy();
  });
});
