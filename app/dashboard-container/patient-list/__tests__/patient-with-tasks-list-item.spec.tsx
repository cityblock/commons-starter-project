import { shallow } from 'enzyme';
import React from 'react';
import { patient, task } from '../../../shared/util/test-data';
import PatientTasks from '../../tasks/patient-tasks';
import PatientListItem, { IProps } from '../patient-list-item';
import { PatientWithTasksListItem } from '../patient-with-tasks-list-item';

describe('Dashboard Patient with Tasks List Item', () => {
  const placeholderFn = jest.fn();
  const selectedPatientId = 'jonSnow';

  const wrapper = shallow(
    <PatientWithTasksListItem
      patient={patient}
      tasksDueSoon={[task]}
      tasksWithNotifications={[task]}
      toggleSelectedPatient={placeholderFn}
      selectedPatientId={selectedPatientId}
    />,
  );

  it('returns patient list item for urgent tasks view', () => {
    expect(wrapper.find(PatientListItem).length).toBe(1);
    expect(wrapper.find<IProps>(PatientListItem).props().patient).toEqual(patient);
    expect(wrapper.find<IProps>(PatientListItem).props().displayType).toBe('task');
    expect(wrapper.find<IProps>(PatientListItem).props().selected).toBeFalsy();
  });

  it('does not render patient tasks if not selected or loading', () => {
    expect(wrapper.find(PatientTasks).length).toBe(0);
  });

  it('applies opaque styles if other patient selected', () => {
    expect(wrapper.find('div').props().className).toBe('opaque');
  });

  it('renders patient tasks if all loaded and patient selected', () => {
    wrapper.setProps({
      tasksDueSoonLoading: false,
      tasksDueSoonError: null,
      tasksWithNotificationsLoading: false,
      tasksWithNotificationsError: null,
      selectedPatientId: patient.id,
    });

    expect(wrapper.find(PatientTasks).length).toBe(1);
    expect(wrapper.find(PatientTasks).props().tasksDueSoon).toEqual([task]);
    expect(wrapper.find(PatientTasks).props().tasksWithNotifications).toEqual([task]);
  });

  it('applies sticky scroll styles to selected patient', () => {
    expect(wrapper.find<IProps>(PatientListItem).props().selected).toBeTruthy();
  });

  it('does not apply opaque styles if selected', () => {
    expect(wrapper.find('.opaque').length).toBe(0);
  });
});
