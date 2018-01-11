import { shallow } from 'enzyme';
import * as React from 'react';
import EmptyPlaceholder from '../../../shared/library/empty-placeholder/empty-placeholder';
import { patient } from '../../../shared/util/test-data';
import PatientWithTasksList from '../patient-with-tasks-list';
import PatientWithTasksListItem, { IProps } from '../patient-with-tasks-list-item';

describe('Dashboard Patient with Tasks List', () => {
  const placeholderFn = () => true as any;
  const selectedPatientId = 'jonSnow';

  const wrapper = shallow(
    <PatientWithTasksList
      patients={[patient]}
      toggleSelectedPatient={placeholderFn}
      selectedPatientId={selectedPatientId}
    />,
  );

  it('renders list of patients', () => {
    expect(wrapper.find('.list').length).toBe(1);
  });

  it('renders patient with tasks list item', () => {
    expect(wrapper.find(PatientWithTasksListItem).length).toBe(1);
    expect(wrapper.find<IProps>(PatientWithTasksListItem).props().patient).toEqual(patient);
    expect(wrapper.find<IProps>(PatientWithTasksListItem).props().selectedPatientId).toBe(
      selectedPatientId,
    );
  });

  it('renders empty placeholder if no patients present', () => {
    wrapper.setProps({ patients: [] });
    expect(wrapper.find(EmptyPlaceholder).length).toBe(1);
    expect(wrapper.find('.empty').length).toBe(1);
  });
});
