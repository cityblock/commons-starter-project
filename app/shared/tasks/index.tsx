import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Route } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as taskDeleteMutationGraphql from '../../graphql/queries/task-delete-mutation.graphql';
import {
  taskDeleteMutation,
  taskDeleteMutationVariables,
  FullPatientGoalFragment,
  FullTaskFragment,
  ShortPatientFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../css/sort-search.css';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
import Task from '../task/task';
import TaskCreate from '../task/task-create';
import * as styles from './css/tasks.css';
import TaskRow from './task-row';
import { TasksLoadingError } from './tasks-loading-error';

type OrderByOptions = 'createdAtDesc' | 'createdAtAsc' | 'dueAtAsc' | 'updatedAtAsc';

export interface IPageParams {
  orderBy: OrderByOptions;
}

interface IProps {
  routeBase: string;
  patient?: ShortPatientFragment;
  patientGoals?: FullPatientGoalFragment[];
  tasks?: FullTaskFragment[];
  loading?: boolean;
  error?: string;
  updatePageParams: (params: IPageParams) => any;
  fetchMoreTasks: () => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  mutate?: any;
  taskId: string;
}

interface IGraphqlProps {
  deleteTask: (options: { variables: taskDeleteMutationVariables }) => { data: taskDeleteMutation };
}

interface IDispatchProps {
  redirectToTasks: () => void;
}

interface IState {
  orderBy: OrderByOptions;
  showCreateTask: false;
}

type allProps = IProps & IDispatchProps & IGraphqlProps;

const getPageParams = () => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
  };
};

class Tasks extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    this.renderTasks = this.renderTasks.bind(this);
    this.renderTask = this.renderTask.bind(this);
    this.showCreateTask = this.showCreateTask.bind(this);
    this.hideCreateTask = this.hideCreateTask.bind(this);
    this.onSortChange = this.onSortChange.bind(this);
    this.onDeleteTask = this.onDeleteTask.bind(this);

    const pageParams = getPageParams();
    this.state = {
      showCreateTask: false,
      orderBy: (pageParams.orderBy as any) || 'createdAtDesc',
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  showCreateTask() {
    this.setState(() => ({ showCreateTask: true }));
  }

  hideCreateTask() {
    this.setState(() => ({ showCreateTask: false }));
  }

  renderTasks(tasks: FullTaskFragment[]) {
    const { loading, error } = this.props;
    const validTasks = tasks.filter(task => !task.deletedAt);

    if (validTasks.length) {
      return validTasks.map(this.renderTask);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyTasksMessage}>
          <div className={styles.emptyTasksLogo} />
          <FormattedMessage id="tasks.noTasks">
            {(message: string) => <div className={styles.emptyTasksLabel}>{message}</div>}
          </FormattedMessage>
        </div>
      );
    } else {
      return <TasksLoadingError error={error} loading={loading} onRetryClick={() => false} />;
    }
  }

  renderTask(task: FullTaskFragment) {
    const selected = task.id === this.props.taskId;
    return (
      <TaskRow key={task.id} task={task} selected={selected} routeBase={this.props.routeBase} />
    );
  }

  onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as OrderByOptions;
    this.setState({
      orderBy: value,
    });
    this.props.updatePageParams({ orderBy: value });
  }

  async onDeleteTask(taskId: string) {
    const { redirectToTasks, deleteTask } = this.props;

    await deleteTask({ variables: { taskId } });

    redirectToTasks();
  }

  render() {
    const {
      tasks,
      routeBase,
      taskId,
      patient,
      patientGoals,
      error,
      loading,
      hasNextPage,
      fetchMoreTasks,
    } = this.props;

    const { orderBy, showCreateTask } = this.state;
    const tasksList = tasks || [];
    const taskContainerStyles = classNames(styles.taskContainer, {
      [styles.visible]: !!taskId || showCreateTask,
    });
    const createTaskButton = patient ? (
      <div className={styles.createContainer}>
        <FormattedMessage id="tasks.createTask">
          {(message: string) => (
            <div onClick={this.showCreateTask} className={styles.createButton}>
              {message}
            </div>
          )}
        </FormattedMessage>
      </div>
    ) : null;
    const createTaskHtml =
      patient && showCreateTask ? (
        <TaskCreate
          patient={patient}
          patientGoals={patientGoals}
          onClose={this.hideCreateTask}
          routeBase={this.props.routeBase}
        />
      ) : null;
    const RenderedTask = (props: any) => (
      <Task
        routeBase={routeBase}
        onDelete={this.onDeleteTask}
        patientGoals={patientGoals}
        taskId={taskId}
        {...props}
      />
    );
    const taskHtml = showCreateTask ? null : (
      <Route path={`${routeBase}/:taskId`} render={RenderedTask} />
    );
    return (
      <div className={styles.container}>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={orderBy} onChange={this.onSortChange}>
                <option value="createdAtDesc">Newest first</option>
                <option value="createdAtAsc">Oldest first</option>
                <option value="dueAtAsc">Due soonest</option>
                <option value="dueAtDesc">Due latest</option>
                <option value="updatedAtDesc">Last updated</option>
                <option value="updatedAtAsc">Last updated desc</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, styles.search)}>
              <input required type="text" placeholder="Search by user or keywords" />
            </div>
          </div>
          {createTaskButton}
        </div>
        <div className={styles.bottomContainer}>
          <InfiniteScroll
            loading={loading}
            error={error}
            fetchMore={fetchMoreTasks}
            hasNextPage={hasNextPage}
            isEmpty={tasks ? tasks.length > 0 : true}
            compressed={!!taskId || showCreateTask}
          >
            {this.renderTasks(tasksList)}
          </InfiniteScroll>
          <div className={taskContainerStyles}>
            {taskHtml}
            {createTaskHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>, ownProps: IProps): IDispatchProps {
  return {
    redirectToTasks: () => {
      const { routeBase } = ownProps;
      dispatch(push(routeBase));
    },
  };
}

export default compose(
  connect<{}, IDispatchProps, IProps>(null, mapDispatchToProps),
  graphql<IGraphqlProps>(taskDeleteMutationGraphql as any, { name: 'deleteTask' }),
)(Tasks);
