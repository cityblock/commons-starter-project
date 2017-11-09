import { shallow } from 'enzyme';
import * as React from 'react';
import PatientConcerns from '../concerns';
import PatientConcern from '../concerns/concern';

describe('Patient Care Plan Concerns Component', () => {
  const onClick = (() => true) as any;
  const onOptionsToggle = (() => () => true) as any;

  it('renders no concerns if there are none', () => {
    const wrapper = shallow(
      <PatientConcerns onClick={onClick} onOptionsToggle={onOptionsToggle} concerns={[]} />,
    );

    expect(wrapper.find(PatientConcern).length).toBe(0);
  });

  it('renders concerns marking selected and options dropdown correctly', () => {
    const selectedPatientConcernId = 'jonSnow';
    const optionsDropdownConcernId = 'khalDrogo';

    const selectedConcern = {
      id: selectedPatientConcernId,
    };

    const optionsDropdownConcern = {
      id: optionsDropdownConcernId,
    };

    const concerns = [selectedConcern, optionsDropdownConcern] as any;

    const wrapper = shallow(
      <PatientConcerns
        onClick={onClick}
        onOptionsToggle={onOptionsToggle}
        selectedPatientConcernId={selectedPatientConcernId}
        optionsDropdownConcernId={optionsDropdownConcernId}
        concerns={concerns}
      />,
    );

    expect(wrapper.find(PatientConcern).length).toBe(2);

    expect(
      wrapper
        .find(PatientConcern)
        .at(0)
        .props().selected,
    ).toBeTruthy();
    expect(
      wrapper
        .find(PatientConcern)
        .at(0)
        .props().optionsOpen,
    ).toBeFalsy();

    expect(
      wrapper
        .find(PatientConcern)
        .at(1)
        .props().selected,
    ).toBeFalsy();
    expect(
      wrapper
        .find(PatientConcern)
        .at(1)
        .props().optionsOpen,
    ).toBeTruthy();
  });
});
