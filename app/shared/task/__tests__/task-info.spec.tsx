import { shallow } from 'enzyme';
import * as React from 'react';
import TaskInfo from '../task-info';

describe('Task Info Component', () => {
  const title = 'Perfect acting for celebrity';
  const description = 'There are no words';
  const taskId = 'brennanMoore';

  const editTask = () => true as any;
  const wrapper = shallow(
    <TaskInfo title={title} description={description} taskId={taskId} editTask={editTask} />,
  );

  it('renders task title if not in edit mode', () => {
    expect(wrapper.find('h2').length).toBe(1);
    expect(wrapper.find('h2').text()).toBe(title);
    expect(wrapper.find('textarea').length).toBe(2);
  });

  it('renders description if not in edit mode', () => {
    expect(wrapper.find('p').length).toBe(1);
    expect(wrapper.find('p').text()).toBe(description);
    expect(wrapper.find('textarea').length).toBe(2);
  });
});
