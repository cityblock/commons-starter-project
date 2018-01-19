import { shallow } from 'enzyme';
import { cloneDeep } from 'lodash';
import * as React from 'react';
import PatientConcernStats from '../concerns/concern-stats/concern-stats';
import PatientConcernOptions from '../concerns/options-menu/options-menu';
import PatientConcern from '../concerns/patient-concern';
import PatientGoal from '../goals/goal';
import { checkIfDueSoon } from '../util/due-date';
import { patientConcern, task } from '../util/test-data';

describe('Patient Concern Component', () => {
  const onClick = () => true;
  const selectedTaskId = 'aryaStark';

  const wrapper = shallow(
    <PatientConcern
      patientConcern={patientConcern}
      selected={true}
      onClick={onClick}
      selectedTaskId={selectedTaskId}
      isDragging={true}
    />,
  );

  it('renders concern title', () => {
    expect(wrapper.find('h3').length).toBe(1);
    expect(wrapper.find('h3').text()).toBe(patientConcern.concern.title);
  });

  it('renders patient concern stats', () => {
    expect(wrapper.find(PatientConcernStats).length).toBe(1);

    expect(wrapper.find(PatientConcernStats).props().goalCount).toBe(1);
    expect(wrapper.find(PatientConcernStats).props().taskCount).toBe(1);
    expect(wrapper.find(PatientConcernStats).props().createdAt).toBe(patientConcern.createdAt);
    expect(wrapper.find(PatientConcernStats).props().lastUpdated).toBe(patientConcern.updatedAt);
    expect(wrapper.find(PatientConcernStats).props().inactive).toBeFalsy();
  });

  it('renders patient goals', () => {
    expect(wrapper.find(PatientGoal).length).toBe(1);
    expect(wrapper.find(PatientGoal).props().patientGoal).toBe(patientConcern.patientGoals[0]);
    expect(wrapper.find(PatientGoal).props().goalNumber).toBe(1);
  });

  it('applies selected styles if specified', () => {
    expect(wrapper.find('.selected').length).toBe(1);
  });

  it('does not apply inactive styles if not inactive', () => {
    expect(wrapper.find('.inactive').length).toBe(0);
  });

  it('renders options menu', () => {
    expect(wrapper.find(PatientConcernOptions).length).toBe(1);
    expect(wrapper.find(PatientConcernOptions).props().patientId).toBe(patientConcern.patientId);
    expect(wrapper.find(PatientConcernOptions).props().patientConcernTitle).toBe(
      patientConcern.concern.title,
    );
  });

  it('shows a notification badge when its tasks have notifications', () => {
    const task2 = cloneDeep(task);
    task2.dueAt = new Date(Date.now() + 60 * 60 * 24 * 5 * 1000).toISOString();
    task2.id = 'task-id-2';

    const patientConcern2 = cloneDeep(patientConcern);
    patientConcern2.patientGoals[0].tasks = [task2];
    expect(checkIfDueSoon(patientConcern2.patientGoals[0].tasks[0].dueAt)).toBe(false);

    // The current concern has an overdue task
    expect(checkIfDueSoon(patientConcern.patientGoals[0].tasks[0].dueAt)).toBe(true);
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    // Set notification on task and have it be overdue and unselected
    wrapper.setProps({ taskIdsWithNotifications: [task.id], selected: false });
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    // Set task to be due 5 days in the future and have no notifications
    wrapper.setProps({ patientConcern: patientConcern2, taskIdsWithNotifications: [] });
    expect(wrapper.find('.notificationBadge').length).toBe(0);

    // Set notification on task inside of concern
    wrapper.setProps({ taskIdsWithNotifications: [task2.id] });
    expect(wrapper.find('.notificationBadge').length).toBe(1);

    wrapper.setProps({ taskIdsWithNotifications: [task.id] });
    expect(wrapper.find('.notificationBadge').length).toBe(0);

  });
});
