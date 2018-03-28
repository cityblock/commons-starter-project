import { mount, shallow } from 'enzyme';
import * as React from 'react';
import * as uuid from 'uuid/v4';
import Spinner from '../../library/spinner/spinner';
import ApolloTestProvider from '../../util/apollo-test-provider';
import { comment, taskWithComment, CBOReferral } from '../../util/test-data';
import TaskHeader from '../header';
import { Divider, Task } from '../task';
import TaskContainer from '../task';
import TaskAssignee, { IProps } from '../task-assignee';
import TaskBody from '../task-body';
import TaskComments, { IProps as ITaskCommentsProps } from '../task-comments';
import TaskDelete from '../task-delete';
import TaskProgress from '../task-progress';
import TaskTracking from '../task-tracking';

describe('Task Component', () => {
  const placeholderFn = () => true as any;
  const routeBase = '/tasks';
  const taskId = taskWithComment.id;
  const patientId = taskWithComment.patientId;
  const history = { push: jest.fn } as any;
  const taskQuery = () => taskWithComment;
  const commentsQuery = () => ({ ...comment, id: uuid() });
  const graphqlMocks = () => ({
    Task: taskQuery,
    TaskComment: commentsQuery,
  });
  const container = mount(
    <ApolloTestProvider graphqlMocks={graphqlMocks()}>
      <TaskContainer taskId={taskWithComment.id} routeBase="/tasks" />
    </ApolloTestProvider>,
  );

  it('does not render loading spinner if not loading', () => {
    const wrapper = container.update(); // .find(TaskContainer);
    expect(wrapper.find(Spinner).length).toBe(0);
  });

  it('renders the task header with correct props', () => {
    const wrapper = container.update(); // .find(TaskContainer);
    const header = wrapper.find(TaskHeader);

    expect(header.length).toBe(1);
    expect(header.props().taskId).toBe(taskId);
    expect(header.props().patientName).toBe('Bob Smith');
    expect(header.props().routeBase).toBe(routeBase);
  });

  it('renders four dividers', () => {
    const wrapper = container.update();
    expect(wrapper.find(Divider).length).toBe(4);
  });

  it('renders task progress with correct props', () => {
    const wrapper = container.update();
    const progress = wrapper.find(TaskProgress);

    expect(progress.length).toBe(1);
    expect(progress.props().taskId).toBe(taskId);
    expect(progress.props().dueAt).toBe('2017-09-07T13:45:14.532Z');
    expect(progress.props().completedAt).toBeFalsy();
  });

  it('renders task body with correct props', () => {
    const wrapper = container.update();
    const body = wrapper.find(TaskBody);

    expect(body.length).toBe(1);
    expect(body.props().taskId).toBe(taskId);
    expect(body.props().title).toBe(taskWithComment.title);
    expect(body.props().description).toBeFalsy();
    expect(body.props().CBOReferral.id).toBe(CBOReferral.id);
    expect(body.props().patientId).toBe(patientId);
  });

  it('renders task assignee with correct props', () => {
    const wrapper = container.update();
    const assignee = wrapper.find<IProps>(TaskAssignee);

    expect(assignee.length).toBe(1);
    expect(assignee.props().patientId).toBe(patientId);
    expect(assignee.props().assignee!.id).toBe(taskWithComment.assignedTo.id);
  });

  it('renders task tracking with correct props', () => {
    const wrapper = container.update();
    const tracking = wrapper.find(TaskTracking);

    expect(tracking.length).toBe(1);
    expect(tracking.props().taskId).toBe(taskId);
    expect(tracking.props().patientId).toBe(patientId);
    expect(tracking.props().priority).toBe(taskWithComment.priority);
    expect(tracking.props().followers[0].id).toEqual(taskWithComment.followers[0].id);
  });

  it('renders task comments with correct props', () => {
    const wrapper = container.update(); // .find(TaskContainer);
    const comments = wrapper.find<ITaskCommentsProps>(TaskComments);

    expect(comments.length).toBe(1);
    expect(comments.props().taskId).toBe(taskId);
  });

  it('renders loading component if fetching data', () => {
    const wrapper2 = shallow(
      <Task
        editTask={placeholderFn}
        routeBase={routeBase}
        taskId={taskId}
        task={taskWithComment as any}
        taskLoading={true}
        taskError={null}
        history={history}
        dismissTaskNotifications={() => false as any}
      />,
    );

    expect(wrapper2.find(TaskHeader).length).toBe(0);
    expect(wrapper2.find(Spinner).length).toBe(1);
  });

  it('renders task delete if delete confirmation in progress', () => {
    const wrapper = container.update(); // .find(TaskContainer);
    const task = wrapper.find(Task).instance() as Task;
    task.confirmDelete();

    // update to re-render after confirm delete
    container.update();

    expect(wrapper.find(TaskDelete).length).toBe(1);
    expect(wrapper.find(TaskDelete).props().taskId).toBe(taskId);
  });
});
