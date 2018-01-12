import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import PatientWithTasksList from '../patient-with-tasks-list';
import PatientWithTasksListItem, { IProps } from '../patient-with-tasks-list-item';

describe('Dashboard Patient with Tasks List', () => {
  const selectedPatientId = 'jonSnow';
  const pageNumber = 1;
  const pageSize = 11;

  const wrapper = shallow(
    <PatientWithTasksList patients={[patient]} pageNumber={pageNumber} pageSize={pageSize} />,
  );

  it('renders list of patients', () => {
    expect(wrapper.find('.list').length).toBe(1);
  });

  it('renders patient with tasks list item', () => {
    expect(wrapper.find(PatientWithTasksListItem).length).toBe(1);
    expect(wrapper.find<IProps>(PatientWithTasksListItem).props().patient).toEqual(patient);
    expect(wrapper.find<IProps>(PatientWithTasksListItem).props().selectedPatientId).toBeNull();
  });

  it('passes selected patient id to patient list', () => {
    wrapper.setState({ selectedPatientId });

    expect(wrapper.find<IProps>(PatientWithTasksListItem).props().selectedPatientId).toBe(
      selectedPatientId,
    );
  });
});
