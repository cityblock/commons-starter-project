import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcernOption from '../concerns/options-menu/option';

describe('Patient Concern Option Menu Item', () => {
  const label = 'Add a new goal';
  const icon = 'add';
  const wrapper = shallow(<PatientConcernOption label={label} icon={icon} />);

  it('renders label and icon', () => {
    expect(wrapper.find('p').props().children).toBe(label);
    expect(wrapper.find('i').length).toBe(1);
  });

  it('applies correct styling to menu items', () => {
    expect(wrapper.find('.option').length).toBe(1);
    expect(wrapper.find('i').props().className).toBe('addIcon');
  });
});
