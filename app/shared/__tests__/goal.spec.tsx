import { shallow } from 'enzyme';
import * as React from 'react';
import { patientGoal } from '../../shared/util/test-data';
import PatientGoal from '../goals/goal';
import GoalOptions from '../goals/goal-options';

describe('Patient Goal Component', () => {
  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <PatientGoal
      goalNumber={1}
      patientGoal={patientGoal}
      selectedTaskId=""
      optionsOpen={false}
      onOptionsToggle={placeholderFn}
    />,
  );

  it('does not apply inactive styles if a task is not selected', () => {
    expect(wrapper.find('.inactive').length).toBe(0);
  });

  it('renders patient goal options menu', () => {
    expect(wrapper.find(GoalOptions).length).toBe(1);
    expect(wrapper.find(GoalOptions).props().open).toBeFalsy();
    expect(wrapper.find(GoalOptions).props().onMenuToggle).toBe(placeholderFn);
  });

  it('opens goal options menu', () => {
    wrapper.setProps({ optionsOpen: true });
    expect(wrapper.find(GoalOptions).props().open).toBeTruthy();
  });

  it('applies inactive styles if a task selected', () => {
    const wrapper2 = shallow(
      <PatientGoal
        goalNumber={1}
        patientGoal={patientGoal}
        selectedTaskId="aryaStark"
        optionsOpen={false}
        onOptionsToggle={placeholderFn}
      />,
    );

    expect(wrapper2.find('.inactive').length).toBe(1);
  });
});
