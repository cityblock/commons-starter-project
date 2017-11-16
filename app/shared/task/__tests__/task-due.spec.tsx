import { shallow } from 'enzyme';
import * as React from 'react';
import DateInput from '../../library/date-input/date-input';
import TaskDue from '../task-due';

describe('Task Due Date Component', () => {
  const dueAt = '2017-12-01 00:00:00-05';
  const taskId = 'aryaStark';
  const editTask = () => true as any;

  const wrapper = shallow(
    <TaskDue completedAt="" dueAt={dueAt} taskId={taskId} editTask={editTask} />,
  );

  it('renders date input element', () => {
    expect(wrapper.find(DateInput).length).toBe(1);
  });

  it('renders the input due date', () => {
    const inputValue = wrapper.find(DateInput).props().value;
    expect(inputValue).toBe(dueAt);
  });

  it('renders a due date icon', () => {
    expect(wrapper.find('div').length).toBe(2);
  });

  it('renders completion date if task complete', () => {
    const completedAt = '2017-12-01 00:00:00-05';

    const wrapper2 = shallow(
      <TaskDue completedAt={completedAt} dueAt={dueAt} taskId={taskId} editTask={editTask} />,
    );

    const inputValue = wrapper2.find(DateInput).props().value;
    expect(inputValue).toBe(completedAt);
  });
});
