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
import * as styles from './css/index.css';
import TaskHeader from './header';
import TaskAssignee from './task-assignee';
import TaskBody from './task-body';
import TaskComments from './task-comments';
import TaskProgress from './task-progress';
import TaskTracking from './task-tracking';

export const Divider: React.StatelessComponent<{}> = () => <div className={styles.divider} />;

interface IStateProps {
  taskId?: string;
}

interface IDispatchProps {
  selectTask: (taskId: string) => any;
}

interface IOwnProps {
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
      this.props.selectTask(this.props.taskId);
    }
  }

  confirmDelete = (): void => {
    this.setState({ deleteConfirmation: true });
  };

  render(): JSX.Element {
    const { task, routeBase, editTask } = this.props;

    const patientName =
      task && task.patient
        ? formatPatientName(task.patient.firstName || '', task.patient.lastName || '')
        : 'No Patient';
    const taskId = task && task.id;
    const patientId = task && task.patientId;

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
            goal={(task && task.patientGoal && task.patientGoal.title) || ''}
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
  selectTask: (taskId?: string) => dispatch(selectTask(taskId)),
});

export default compose(
  connect<IStateProps, IDispatchProps, IOwnProps>(mapStateToProps, mapDispatchToProps),
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
)(Task);
