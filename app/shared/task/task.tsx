import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Priority } from '../../../server/models/task';
import { selectTask } from '../../actions/task-action';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import * as taskEditMutationGraphql from '../../graphql/queries/task-edit-mutation.graphql';
import { taskEditMutation, taskEditMutationVariables, FullTaskFragment } from '../../graphql/types';
import { IState as IAppState } from '../../store';
import { formatPatientName } from '../helpers/format-helpers';
import Spinner from '../library/spinner';
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

interface IStateProps {
  taskId?: string;
}

interface IDispatchProps {
  selectTaskAction: (taskId: string) => any;
}

export interface IOwnProps {
  routeBase: string;
  match?: {
    params: {
      taskId?: string;
    };
  };
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

type IProps = IStateProps & IDispatchProps & IOwnProps & IGraphqlProps;

export class Task extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.state = {
      deleteConfirmation: false,
    };
  }

  componentDidMount(): void {
    if (this.props.taskId) {
      this.props.selectTaskAction(this.props.taskId);
    }
  }

  confirmDelete = (): void => {
    this.setState({ deleteConfirmation: true });
  };

  cancelDelete = (): void => {
    this.setState({ deleteConfirmation: false });
  };

  render(): JSX.Element {
    const { task, routeBase, editTask, taskLoading, selectTaskAction } = this.props;

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
            clearTask={() => selectTaskAction('')}
          />
        </div>
      );
    }

    const patientId = task && task.patientId;
    const patientName =
      task && task.patient
        ? formatPatientName(task.patient.firstName || '', task.patient.lastName || '')
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

const mapStateToProps = (state: IAppState, ownProps: IProps): IStateProps => {
  const taskId = state.task.taskId
    ? state.task.taskId
    : ownProps.match ? ownProps.match.params.taskId : '';

  return { taskId };
};

const mapDispatchToProps = (dispatch: Dispatch<() => void>): IDispatchProps => ({
  selectTaskAction: (taskId?: string) => dispatch(selectTask(taskId)),
});

export default compose(
  connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps),
  graphql<IGraphqlProps, IProps>(taskEditMutationGraphql as any, { name: 'editTask' }),
  graphql<IGraphqlProps, IProps>(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: data ? data.loading : false,
      taskError: data ? data.error : null,
      task: data ? (data as any).task : null,
      refetchTask: data ? data.refetch : null,
    }),
  }),
)(Task);
