import { shallow } from 'enzyme';
import * as React from 'react';
import { patientGoal } from '../../shared/util/test-data';
import CreateTaskModal from '../goals/create-task/create-task';
import PatientGoal from '../goals/goal';
import GoalOptions from '../goals/goal-options';

describe('Patient Goal Component', () => {
  const concernTitle = 'Housing';

  const wrapper = shallow(
    <PatientGoal
      goalNumber={1}
      patientGoal={patientGoal}
      selectedTaskId=""
      concernTitle={concernTitle}
    />,
  );

  it('does not apply inactive styles if a task is not selected', () => {
    expect(wrapper.find('.inactive').length).toBe(0);
  });

  it('renders patient goal options menu', () => {
    expect(wrapper.find(GoalOptions).length).toBe(1);
    expect(wrapper.find(GoalOptions).props().open).toBeFalsy();
  });

  it('renders modal component to create task', () => {
    expect(wrapper.find(CreateTaskModal).length).toBe(1);
    expect(wrapper.find(CreateTaskModal).props().visible).toBeFalsy();
    expect(wrapper.find(CreateTaskModal).props().concern).toBe(concernTitle);
    expect(wrapper.find(CreateTaskModal).props().goal).toBe(patientGoal.title);
    expect(wrapper.find(CreateTaskModal).props().patientGoalId).toBe(patientGoal.id);
  });

  it('opens modal to create task', () => {
    wrapper.setState({ createTaskModal: true });
    expect(wrapper.find(CreateTaskModal).props().visible).toBeTruthy();
  });

  it('applies inactive styles if a task selected', () => {
    const wrapper2 = shallow(
      <PatientGoal
        goalNumber={1}
        patientGoal={patientGoal}
        selectedTaskId="aryaStark"
        concernTitle={concernTitle}
      />,
    );

    expect(wrapper2.find('.inactive').length).toBe(1);
  });
});
