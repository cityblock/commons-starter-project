import * as classNames from 'classnames';
import { History } from 'history';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as eventNotificationsForTaskDismissMutation from '../../graphql/queries/event-notifications-for-task-dismiss-mutation.graphql';
import * as taskIdsWithNotificationsQuery from '../../graphql/queries/get-task-ids-with-notifications.graphql';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import * as taskEditMutationGraphql from '../../graphql/queries/task-edit-mutation.graphql';
import {
  eventNotificationsForTaskDismissMutationVariables,
  taskEditMutation,
  taskEditMutationVariables,
  FullEventNotificationFragment,
  FullTaskFragment,
  Priority,
} from '../../graphql/types';
import { formatFullName } from '../helpers/format-helpers';
import Spinner from '../library/spinner/spinner';
import * as styles from './css/index.css';
import TaskHeader from './header';
import TaskAssignee from './task-assignee';
import TaskBody from './task-body';
import TaskComments from './task-comments';
import TaskDelete from './task-delete';
import TaskProgress from './task-progress';
import TaskTracking from './task-tracking';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.divider} />;

export interface IProps {
  routeBase: string;
  taskId: string;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  task: FullTaskFragment;
  taskLoading?: boolean;
  taskError: string | null;
  dismissTaskNotifications: (
    options: { variables: eventNotificationsForTaskDismissMutationVariables },
  ) => { data: { eventNotificationsForTaskDismiss: FullEventNotificationFragment } };
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  deleteConfirmation: boolean;
}

type allProps = IProps & IGraphqlProps & IRouterProps;

export class Task extends React.Component<allProps, IState> {
  state = {
    deleteConfirmation: false,
  };

  componentDidMount() {
    const { taskId, dismissTaskNotifications } = this.props;
    dismissTaskNotifications({ variables: { taskId } });
  }

  confirmDelete = (): void => {
    this.setState({ deleteConfirmation: true });
  };

  cancelDelete = (): void => {
    this.setState({ deleteConfirmation: false });
  };

  onAssigneeClick = async (careTeamMemberId: string) => {
    const { editTask, task } = this.props;
    const taskId = task && task.id;

    if (taskId) await editTask({ variables: { assignedToId: careTeamMemberId, taskId } });
  };

  onPriorityClick = async (priority: Priority) => {
    const { editTask, task } = this.props;
    const taskId = task && task.id;

    if (taskId) await editTask({ variables: { taskId, priority } });
  };

  redirectToMap = () => {
    const { history, routeBase } = this.props;
    history.push(routeBase);
  };

  renderLoading() {
    return (
      <div className={classNames(styles.container, styles.center)}>
        <Spinner />
      </div>
    );
  }

  renderConfirmDelete() {
    const { task } = this.props;
    const taskId = task && task.id;
    return (
      <div className={classNames(styles.container, styles.center)}>
        <TaskDelete
          taskId={taskId}
          patientId={task.patientId}
          cancelDelete={this.cancelDelete}
          redirectToMap={this.redirectToMap}
        />
      </div>
    );
  }

  // prevent task from closing when task clicked on
  stopPropagation = (e: React.MouseEvent<HTMLDivElement>): void => {
    if (this.props.taskId) {
      e.stopPropagation();
    }
  };

  renderTask(task: FullTaskFragment) {
    const { routeBase, editTask } = this.props;
    const patientName = task.patient
      ? formatFullName(task.patient.firstName || '', task.patient.lastName || '')
      : 'No Patient';
    const goal = task.patientGoal;
    const concern = goal && goal.patientConcern && goal.patientConcern.concern;

    return (
      <div className={styles.container} onClick={this.stopPropagation}>
        <div className={styles.task}>
          <TaskHeader
            taskId={task.id}
            patientName={patientName}
            confirmDelete={this.confirmDelete}
            routeBase={routeBase}
            patientId={task.patientId}
          />
          <Divider />
          <TaskProgress
            taskId={task.id}
            dueAt={task.dueAt}
            completedAt={task.completedAt}
            editTask={editTask}
          />
          <Divider />
          <TaskBody
            taskId={task.id}
            title={task.title}
            description={task.description || ''}
            concern={(concern && concern.title) || ''}
            goal={(goal && goal.title) || ''}
            CBOReferral={task.CBOReferral}
            editTask={editTask}
            patientId={task.patientId}
          />
          <TaskAssignee
            patientId={task.patientId}
            assignee={task.assignedTo || null}
            onAssigneeClick={this.onAssigneeClick}
          />
          <TaskTracking
            taskId={task.id}
            patientId={task.patientId}
            priority={task.priority as Priority}
            followers={task.followers || []}
            onPriorityClick={this.onPriorityClick}
          />
        </div>
        <TaskComments taskId={task.id} />
      </div>
    );
  }

  render() {
    const { task, taskLoading } = this.props;
    const { deleteConfirmation } = this.state;
    if (taskLoading) {
      return this.renderLoading();
    } else if (deleteConfirmation) {
      return this.renderConfirmDelete();
    } else if (task) {
      return this.renderTask(task);
    }
    return null;
  }
}

export default compose(
  withRouter,
  graphql(taskEditMutationGraphql as any, { name: 'editTask' }),
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: data ? data.loading : false,
      taskError: data ? data.error : null,
      task: data ? (data as any).task : null,
      refetchTask: data ? data.refetch : null,
    }),
  }),
  graphql(eventNotificationsForTaskDismissMutation as any, {
    name: 'dismissTaskNotifications',
    options: {
      refetchQueries: [{ query: taskIdsWithNotificationsQuery as any }],
    },
  }),
)(Task) as React.ComponentClass<IProps>;
