import { shallow } from 'enzyme';
import * as React from 'react';
import ModalButtons from '../../../library/modal-buttons/modal-buttons';
import ModalHeader from '../../../library/modal-header/modal-header';
import { Popup } from '../../../popup/popup';
import TaskAssignee, { IProps } from '../../../task/task-assignee';
import { CreateTaskModal } from '../create-task';
import CreateTaskDescription from '../description';
import CreateTaskDueDate from '../due-date';
import CreateTaskInfo from '../info';
import CreateTaskPriority from '../priority';
import CreateTaskTitle from '../title';

describe('Create Task Modal Component', () => {
  const concern = 'Eleven understandign her past';
  const goal = 'Find 008';
  const patientId = '011';
  const patientGoalId = 'terryIves';
  const closePopup = () => true as any;

  const wrapper = shallow(
    <CreateTaskModal
      visible={false}
      closePopup={closePopup}
      patientId={patientId}
      patientGoalId={patientGoalId}
      createTask={closePopup}
      concern={concern}
      goal={goal}
    />,
  );

  it('renders task header component', () => {
    expect(wrapper.find(ModalHeader).length).toBe(1);
    expect(wrapper.find(ModalHeader).props().titleMessageId).toBe('taskCreate.addTask');
    expect(wrapper.find(ModalHeader).props().bodyMessageId).toBe('taskCreate.detail');
    expect(wrapper.find(ModalHeader).props().color).toBe('navy');
  });

  it('renders task info component with correct props', () => {
    expect(wrapper.find(CreateTaskInfo).props().goal).toBe(goal);
    expect(wrapper.find(CreateTaskInfo).props().concern).toBe(concern);
  });

  it('renders popup component', () => {
    expect(wrapper.find(Popup).length).toBe(1);
    expect(wrapper.find(Popup).props().visible).toBeFalsy();
    expect(wrapper.find(Popup).props().style).toBe('no-padding');
    expect(wrapper.find(Popup).props().className).toBe('popup');
  });

  it('makes popup visible after receiving new props', () => {
    wrapper.setProps({ visible: true });
    expect(wrapper.find(Popup).props().visible).toBeTruthy();
  });

  it('renders fields with correct styles', () => {
    expect(wrapper.find('.fields').length).toBe(1);
  });

  it('renders create task title field', () => {
    expect(wrapper.find(CreateTaskTitle).length).toBe(1);
    expect(wrapper.find(CreateTaskTitle).props().value).toBeFalsy();
  });

  it('changes value of task title', () => {
    const title = 'Eleven';
    wrapper.setState({ title });

    expect(wrapper.find(CreateTaskTitle).props().value).toBe(title);
  });

  it('renders create task description field', () => {
    expect(wrapper.find(CreateTaskDescription).length).toBe(1);
    expect(wrapper.find(CreateTaskDescription).props().value).toBeFalsy();
  });

  it('changes value of task description', () => {
    const description = 'Defender of Hawkins';
    wrapper.setState({ description });

    expect(wrapper.find(CreateTaskDescription).props().value).toBe(description);
  });

  it('renders task assignee component', () => {
    const assignee = wrapper.find<IProps>(TaskAssignee);
    expect(assignee.length).toBe(1);
    expect(assignee.props().patientId).toBe(patientId);
    expect(assignee.props().selectedAssigneeId).toBeFalsy();
    expect(assignee.props().messageId).toBe('taskCreate.assignee');
    expect(assignee.props().messageStyles).toBe('label black');
    expect(assignee.props().dropdownStyles).toBe('dropdown');
    expect(assignee.props().menuStyles).toBe('menu');
  });

  it('changes value of task assignee', () => {
    wrapper.setState({ assignedToId: patientId });
    const assignee = wrapper.find<IProps>(TaskAssignee);
    expect(assignee.props().selectedAssigneeId).toBe(patientId);
    expect(assignee.props().messageStyles).toBe('label');
  });

  it('renders date picker', () => {
    expect(wrapper.find(CreateTaskDueDate).length).toBe(1);
    expect(wrapper.find(CreateTaskDueDate).props().value).toBeTruthy();
  });

  it('changes date', () => {
    const dueAt = '11/11/2017';
    wrapper.setState({ dueAt });
    expect(wrapper.find(CreateTaskDueDate).props().value).toBe(dueAt);
  });

  it('renders priority select', () => {
    expect(wrapper.find(CreateTaskPriority).length).toBe(1);
    expect(wrapper.find(CreateTaskPriority).props().value).toBeFalsy();
  });

  it('changes priority', () => {
    const priority = 'low';
    wrapper.setState({ priority });

    expect(wrapper.find(CreateTaskPriority).props().value).toBe(priority);
  });

  it('renders modal buttons', () => {
    expect(wrapper.find(ModalButtons).length).toBe(1);
    expect(wrapper.find(ModalButtons).props().cancelMessageId).toBe('taskCreate.cancel');
    expect(wrapper.find(ModalButtons).props().submitMessageId).toBe('taskCreate.submit');
  });
});
