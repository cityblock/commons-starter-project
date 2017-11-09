import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcernOptions, { Divider } from '../concerns/options-menu';
import PatientConcernOption from '../concerns/options-menu/option';

describe('Patient Concern Options Menu Component', () => {
  const wrapper = shallow(<PatientConcernOptions inactive={false} />);

  it('renders the correct amount of menu items', () => {
    expect(wrapper.find(PatientConcernOption).length).toBe(5);
  });

  it('renders the correct amount of dividers between menu items', () => {
    const numMenuItems = wrapper.find(PatientConcernOption).length;
    expect(wrapper.find(Divider).length).toBe(numMenuItems - 1);
  });
});
