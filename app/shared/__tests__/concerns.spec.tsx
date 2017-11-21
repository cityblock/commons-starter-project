import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcerns from '../concerns';
import PatientConcern from '../concerns/concern';

describe('Patient Care Plan Concerns Component', () => {
  const onClick = (() => true) as any;
  const onOptionsToggle = (() => () => true) as any;

  it('renders no concerns if there are none', () => {
    const wrapper = shallow(
      <PatientConcerns
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        concerns={[]}
        selectedTaskId='' />,
    );

    expect(wrapper.find(PatientConcern).length).toBe(0);
  });
});
