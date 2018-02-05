import { shallow } from 'enzyme';
import * as React from 'react';
import TaskAssignee, { IProps } from '../../../task/task-assignee';
import CreateTaskShared from '../create-task-shared';
import CreateTaskDescription from '../description';
import CreateTaskDueDate from '../due-date';
import CreateTaskPriority from '../priority';

describe('Create Task Share Fields', () => {
  const placeholderFn = () => true as any;
  const patientId = 'jonSnow';
  const title = 'Defeat the Night King';
  const description = 'The epic final battle in the war for the dawn';
  const priority = 'high';

  const taskFields = {
    title,
    taskType: 'general',
    categoryId: '',
    dueAt: new Date().toISOString(),
    description,
    assignedToId: '',
    priority,
    CBOName: '',
    CBOUrl: '',
    CBOId: '',
  } as any;

  const wrapper = shallow(
    <CreateTaskShared
      taskFields={taskFields}
      patientId={patientId}
      onChange={placeholderFn}
      onAssigneeClick={placeholderFn}
      onPriorityClick={placeholderFn}
      onDueAtChange={placeholderFn}
    />,
  );

  it('renders create task description field', () => {
    expect(wrapper.find(CreateTaskDescription).length).toBe(1);
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
    expect(assignee.props().largeFont).toBeTruthy();
  });

  it('renders date picker', () => {
    expect(wrapper.find(CreateTaskDueDate).length).toBe(1);
    expect(wrapper.find(CreateTaskDueDate).props().value).toBeTruthy();
  });

  it('renders priority select', () => {
    expect(wrapper.find(CreateTaskPriority).length).toBe(1);
    expect(wrapper.find(CreateTaskPriority).props().value).toBe(priority);
  });
});
