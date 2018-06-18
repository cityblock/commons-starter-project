import { shallow, ShallowWrapper } from 'enzyme';
import React from 'react';
import DateInput from '../../library/date-input/date-input';
import Icon from '../../library/icon/icon';
import TaskDue from '../task-due';

const oldDate = Date.now;
const dueAt = '2017-12-01 00:00:00-05';
const taskId = 'aryaStark';
const editTask = jest.fn();

describe('Task Due Date Component', () => {
  let wrapper: ShallowWrapper<any, any>;

  beforeAll(() => {
    Date.now = jest.fn(() => 1500494779252);

    wrapper = shallow(<TaskDue completedAt="" dueAt={dueAt} taskId={taskId} editTask={editTask} />);
  });
  afterAll(() => {
    Date.now = oldDate;
  });

  it('renders date input element', () => {
    expect(wrapper.find(DateInput).length).toBe(1);
  });

  it('renders the input due date', () => {
    const inputValue = wrapper.find(DateInput).props().value;
    expect(inputValue).toBe(dueAt);
  });

  it('renders a due date icon', () => {
    expect(wrapper.find(Icon).length).toBe(1);
    expect(wrapper.find(Icon).props().className).toBe('icon');
  });

  it('renders completion date if task complete', () => {
    const completedAt = '2017-12-01 00:00:00-05';

    const wrapper2 = shallow(
      <TaskDue completedAt={completedAt} dueAt={dueAt} taskId={taskId} editTask={editTask} />,
    );

    const inputValue = wrapper2.find(DateInput).props().value;
    expect(inputValue).toBe(completedAt);

    expect(wrapper2.find(Icon).props().className).toBe('icon completeIcon');
  });
});
