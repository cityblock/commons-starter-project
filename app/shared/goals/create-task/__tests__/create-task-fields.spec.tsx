import { shallow } from 'enzyme';
import * as React from 'react';
import CreateTaskCBO from '../cbo';
import CreateTaskCBOCategory from '../cbo-category';
import CreateTaskFields from '../create-task-fields';
import CreateTaskShared from '../create-task-shared';
import CreateTaskType from '../task-type';
import CreateTaskTitle from '../title';

describe('Create Task Modal Fields', () => {
  const patientId = 'sansaStark';
  const title = 'Escape to Winterfell';

  const taskFields = {
    title,
    taskType: 'general',
    categoryId: '',
    dueAt: '',
    description: '',
    assignedToId: '',
    priority: 'high',
    CBOName: '',
    CBOUrl: '',
    CBOId: '',
  } as any;

  const placeholderFn = () => true as any;

  const wrapper = shallow(
    <CreateTaskFields
      taskFields={taskFields}
      patientId={patientId}
      onChange={placeholderFn}
      onAssigneeClick={placeholderFn}
      onPriorityClick={placeholderFn}
    />,
  );

  it('renders option to select task type', () => {
    expect(wrapper.find(CreateTaskType).length).toBe(1);
    expect(wrapper.find(CreateTaskType).props().value).toBe(taskFields.taskType);
  });

  it('renders create task title field if creating general task', () => {
    expect(wrapper.find(CreateTaskTitle).length).toBe(1);
    expect(wrapper.find(CreateTaskTitle).props().value).toBe(title);
  });

  it('renders shared fields', () => {
    expect(wrapper.find(CreateTaskShared).length).toBe(1);
    expect(wrapper.find(CreateTaskShared).props().taskFields).toEqual(taskFields);
    expect(wrapper.find(CreateTaskShared).props().patientId).toBe(patientId);
  });

  it('renders option to choose CBO category if creating a referral task', () => {
    wrapper.setProps({
      taskFields: {
        ...taskFields,
        taskType: 'CBOReferral',
      },
    });

    expect(wrapper.find(CreateTaskCBOCategory).length).toBe(1);
    expect(wrapper.find(CreateTaskCBOCategory).props().categoryId).toBeFalsy();
  });

  it('does not render CBO selection if category not selected', () => {
    expect(wrapper.find(CreateTaskCBO).length).toBe(0);
    expect(wrapper.find(CreateTaskShared).length).toBe(0);
  });

  it('renders select for individual CBO if category id specified', () => {
    const categoryId = 'foodServices';
    const newTaskFields = {
      ...taskFields,
      taskType: 'CBOReferral',
      categoryId,
    };
    wrapper.setProps({
      taskFields: newTaskFields,
    });

    expect(wrapper.find(CreateTaskCBOCategory).props().categoryId).toBe(categoryId);
    expect(wrapper.find(CreateTaskCBO).length).toBe(1);
    expect(wrapper.find(CreateTaskCBO).props().taskFields).toEqual(newTaskFields);
    expect(wrapper.find(CreateTaskShared).length).toBe(1);
  });
});
