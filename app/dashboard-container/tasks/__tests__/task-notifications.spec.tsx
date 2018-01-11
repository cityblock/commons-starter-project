import { shallow } from 'enzyme';
import * as React from 'react';
import Spinner from '../../../shared/library/spinner/spinner';
import { eventNotification, task } from '../../../shared/util/test-data';
import TaskNotification from '../task-notification';
import { TaskNotifications } from '../task-notifications';

describe('Dashboard Task Notifications Component', () => {
  const wrapper = shallow(
    <TaskNotifications taskId={task.id} notifications={[eventNotification]} />,
  );

  it('renders container', () => {
    expect(wrapper.find('.container').length).toBe(1);
  });

  it('renders a task notification component for each notification', () => {
    expect(wrapper.find(TaskNotification).length).toBe(1);
    expect(wrapper.find(TaskNotification).props().notification).toEqual(eventNotification);
  });

  it('renders a spinner if loading', () => {
    wrapper.setProps({ loading: true });

    expect(wrapper.find(Spinner).length).toBe(1);
    expect(wrapper.find(TaskNotification).length).toBe(0);
  });
});
