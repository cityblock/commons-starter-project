import { shallow } from 'enzyme';
import * as React from 'react';
import { patient } from '../../../shared/util/test-data';
import PatientList from '../patient-list';
import PatientListItem from '../patient-list-item';

describe('Dashboard Patient with Tasks List', () => {
  const wrapper = shallow(<PatientList patients={[patient]} displayType="default" />);

  it('renders list of patients', () => {
    expect(wrapper.find('.list').length).toBe(1);
  });

  it('renders patient with tasks list item', () => {
    expect(wrapper.find(PatientListItem).length).toBe(1);
    expect(wrapper.find(PatientListItem).props().patient).toEqual(patient);
  });
});
