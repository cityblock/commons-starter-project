import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import PatientListItem from '../patient-list-item';
import { PatientWithTasksListItem } from '../patient-with-tasks-list-item';

describe('Dashboard Patient with Tasks List Item', () => {
  const wrapper = shallow(
    <PatientWithTasksListItem patient={patient} tasksDueSoon={[]} tasksWithNotifications={[]} />,
  );

  it('returns patient list item for urgent tasks view', () => {
    expect(wrapper.find(PatientListItem).length).toBe(1);
    expect(wrapper.find(PatientListItem).props().patient).toEqual(patient);
    expect(wrapper.find(PatientListItem).props().taskView).toBeTruthy();
  });
});
