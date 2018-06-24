import { shallow } from 'enzyme';
import React from 'react';
import CreateTaskModal, { IProps } from '../goals/create-task/create-task';
import PatientGoal from '../goals/goal';
import GoalOptions from '../goals/goal-options';
import { patientGoal } from '../util/test-data';

describe('Patient Goal Component', () => {
  const concernTitle = 'Housing';
  const userId = 'daenerysTargaryen';

  const wrapper = shallow(
    <PatientGoal
      goalNumber={1}
      patientGoal={patientGoal}
      selectedTaskId=""
      concernTitle={concernTitle}
      currentUserId={userId}
    />,
  );

  it('does not apply inactive styles if a task is not selected', () => {
    expect(wrapper.find('.inactive').length).toBe(0);
  });

  it('renders patient goal options menu', () => {
    expect(wrapper.find(GoalOptions).length).toBe(1);
    expect((wrapper.find(GoalOptions).props() as any).open).toBeFalsy();
    expect(wrapper.find(GoalOptions).props().patientGoalId).toBe(patientGoal.id);
    expect(wrapper.find(GoalOptions).props().patientGoalTitle).toBe(patientGoal.title);
    expect(wrapper.find(GoalOptions).props().canDelete).toBeFalsy();
  });

  it('renders modal component to create task', () => {
    expect(wrapper.find(CreateTaskModal).length).toBe(1);
    expect(wrapper.find<IProps>(CreateTaskModal as any).props().visible).toBeFalsy();
    expect(wrapper.find<IProps>(CreateTaskModal as any).props().concern).toBe(concernTitle);
    expect(wrapper.find<IProps>(CreateTaskModal as any).props().goal).toBe(patientGoal.title);
    expect(wrapper.find<IProps>(CreateTaskModal as any).props().patientGoalId).toBe(patientGoal.id);
  });

  it('opens modal to create task', () => {
    wrapper.setState({ createTaskModal: true });
    expect(wrapper.find<IProps>(CreateTaskModal as any).props().visible).toBeTruthy();
  });

  it('applies inactive styles if a task selected', () => {
    const wrapper2 = shallow(
      <PatientGoal
        goalNumber={1}
        patientGoal={patientGoal}
        selectedTaskId="aryaStark"
        concernTitle={concernTitle}
        currentUserId={userId}
      />,
    );

    expect(wrapper2.find('.inactive').length).toBe(1);
  });
});
