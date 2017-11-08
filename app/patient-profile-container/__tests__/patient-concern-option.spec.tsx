import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcernOption from '../patient-concern-options/patient-concern-option';

describe('Patient Concern Option Menu Item', () => {
  it('renders label and icon', () => {
    const label = 'Add a new goal';
    const icon = 'add';
    const wrapper = shallow(<PatientConcernOption label={label} icon={icon} />);

    expect(wrapper.find('p').props().children).toBe(label);
    expect(wrapper.find('i').length).toBe(1);
  });
});
