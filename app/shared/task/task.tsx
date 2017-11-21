import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import { Priority } from '../../../server/models/task';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import * as taskEditMutationGraphql from '../../graphql/queries/task-edit-mutation.graphql';
import { taskEditMutation, taskEditMutationVariables, FullTaskFragment } from '../../graphql/types';
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

export const DEFAULT_AVATAR_URL = 'https://bit.ly/2weRwJm';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.divider} />;

interface IDispatchProps {
  redirectToMap: () => void;
}

export interface IProps {
  routeBase: string;
  taskId: string;
}

interface IGraphqlProps {
  task: FullTaskFragment;
  taskLoading?: boolean;
  taskError?: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  deleteConfirmation: boolean;
}

type allProps = IDispatchProps & IProps & IGraphqlProps;

export class Task extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.state = {
      deleteConfirmation: false,
    };
  }

  confirmDelete = (): void => {
    this.setState({ deleteConfirmation: true });
  };

  cancelDelete = (): void => {
    this.setState({ deleteConfirmation: false });
  };

  render(): JSX.Element {
    const { task, routeBase, editTask, taskLoading, redirectToMap } = this.props;
    const taskId = task && task.id;

    if (taskLoading) {
      return (
        <div className={classNames(styles.container, styles.center)}>
          <Spinner />
        </div>
      );
    } else if (this.state.deleteConfirmation) {
      return (
        <div className={classNames(styles.container, styles.center)}>
          <TaskDelete
            taskId={taskId}
            cancelDelete={this.cancelDelete}
            redirectToMap={redirectToMap}
          />
        </div>
      );
    }

    const patientId = task && task.patientId;
    const patientName =
      task && task.patient
        ? formatFullName(task.patient.firstName || '', task.patient.lastName || '')
        : 'No Patient';

    const goal = task && task.patientGoal;
    const concern = goal && goal.patientConcern && goal.patientConcern.concern;

    return (
      <div className={styles.container}>
        <div className={styles.task}>
          <TaskHeader
            taskId={taskId}
            patientName={patientName}
            confirmDelete={this.confirmDelete}
            routeBase={routeBase}
            patientId={patientId}
          />
          <Divider />
          <TaskProgress
            taskId={taskId}
            dueAt={(task && task.dueAt) || ''}
            completedAt={(task && task.completedAt) || ''}
            editTask={editTask}
          />
          <Divider />
          <TaskBody
            taskId={taskId}
            title={task && task.title}
            description={(task && task.description) || ''}
            concern={(concern && concern.title) || ''}
            goal={(goal && goal.title) || ''}
            editTask={editTask}
          />
          <TaskAssignee
            taskId={taskId}
            patientId={patientId}
            assignee={(task && task.assignedTo) || undefined}
            editTask={editTask}
          />
          <TaskTracking
            taskId={taskId}
            patientId={patientId}
            priority={task && (task.priority as Priority)}
            followers={(task && task.followers) || []}
            editTask={editTask}
          />
        </div>
        <TaskComments taskId={taskId} />
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps => ({
  redirectToMap: () => dispatch(push(ownProps.routeBase)),
});

export default compose(
  connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps, IProps, allProps>(taskEditMutationGraphql as any, { name: 'editTask' }),
  graphql<IGraphqlProps, allProps>(taskQuery as any, {
    skip: (props: allProps) => !props.taskId,
    options: (props: allProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: data ? data.loading : false,
      taskError: data ? data.error : null,
      task: data ? (data as any).task : null,
      refetchTask: data ? data.refetch : null,
    }),
  }),
)(Task);
