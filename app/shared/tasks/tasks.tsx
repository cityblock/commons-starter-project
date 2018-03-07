import * as classNames from 'classnames';
import { History } from 'history';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import * as getCurrentUserQuery from '../../graphql/queries/get-current-user.graphql';
import * as taskIdsWithNotificationsQuery from '../../graphql/queries/get-task-ids-with-notifications.graphql';
import * as taskDeleteMutationGraphql from '../../graphql/queries/task-delete-mutation.graphql';
import {
  getTaskIdsWithNotificationsQuery,
  taskDeleteMutation,
  taskDeleteMutationVariables,
  FullPatientGoalFragment,
  FullTaskFragment,
  FullUserFragment,
} from '../../graphql/types';
import * as sortSearchStyles from '../css/sort-search.css';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
import Task from '../task/task';
import * as styles from './css/tasks.css';
import TaskRow from './task-row';
import { TasksLoadingError } from './tasks-loading-error';

type OrderByOptions = 'createdAtDesc' | 'createdAtAsc' | 'dueAtAsc' | 'updatedAtAsc';

export interface IPageParams {
  orderBy: OrderByOptions;
}

export interface IProps {
  routeBase: string;
  patientGoals?: FullPatientGoalFragment[];
  tasks?: FullTaskFragment[];
  loading?: boolean;
  error: string | null;
  updatePageParams: (params: IPageParams) => any;
  fetchMoreTasks: () => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  mutate?: any;
  taskId: string;
  history: History;
  taskIdsWithNotifications?: string[];
}

interface IGraphqlProps {
  deleteTask: (options: { variables: taskDeleteMutationVariables }) => { data: taskDeleteMutation };
  taskIdsWithNotifications?: getTaskIdsWithNotificationsQuery['taskIdsWithNotifications'];
  currentUser: FullUserFragment;
  currentUserLoading?: boolean;
  currentUserError?: string | null;
}

interface IState {
  orderBy: OrderByOptions;
  loading?: boolean;
  error: string | null;
}

type allProps = IProps & IGraphqlProps;

const getPageParams = () => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
  };
};

export class Tasks extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);

    const pageParams = getPageParams();
    this.state = {
      orderBy: (pageParams.orderBy as any) || 'createdAtDesc',
      error: null,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState({ loading, error });
  }

  renderTasks(tasks: FullTaskFragment[]) {
    const { loading, error, currentUser } = this.props;
    const validTasks = tasks.filter(task => !task.deletedAt);

    if (validTasks.length && currentUser) {
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

  renderTask = (task: FullTaskFragment) => {
    const { taskIdsWithNotifications, currentUser } = this.props;

    return (
      <TaskRow
        key={task.id}
        task={task}
        selectedTaskId={this.props.taskId}
        routeBase={this.props.routeBase}
        taskIdsWithNotifications={taskIdsWithNotifications}
        currentUserId={currentUser.id}
      />
    );
  };

  onSortChange = (event: React.ChangeEvent<HTMLSelectElement>): void => {
    const value = event.target.value as OrderByOptions;
    this.setState({
      orderBy: value,
    });
    this.props.updatePageParams({ orderBy: value });
  };

  onDeleteTask = async (taskId: string): Promise<void> => {
    const { history, deleteTask, routeBase } = this.props;

    await deleteTask({ variables: { taskId } });

    history.push(routeBase);
  };

  render() {
    const {
      tasks,
      routeBase,
      taskId,
      patientGoals,
      error,
      loading,
      hasNextPage,
      fetchMoreTasks,
    } = this.props;

    const { orderBy } = this.state;
    const tasksList = tasks || [];
    const taskContainerStyles = classNames(styles.taskContainer, {
      [styles.visible]: !!taskId,
    });

    const RenderedTask = (props: any) => (
      <Task
        routeBase={routeBase}
        onDelete={this.onDeleteTask}
        patientGoals={patientGoals}
        taskId={taskId}
        {...props}
      />
    );
    const taskHtml = <Route path={`${routeBase}/:taskId`} render={RenderedTask} />;
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
          </div>
        </div>
        <div className={styles.bottomContainer}>
          <InfiniteScroll
            loading={loading}
            error={error}
            fetchMore={fetchMoreTasks}
            hasNextPage={hasNextPage}
            isEmpty={tasks ? tasks.length > 0 : true}
            compressed={!!taskId}
          >
            {this.renderTasks(tasksList)}
          </InfiniteScroll>
          <div className={taskContainerStyles}>{taskHtml}</div>
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps>(taskDeleteMutationGraphql as any, { name: 'deleteTask' }),
  graphql<IGraphqlProps, IProps, allProps>(taskIdsWithNotificationsQuery as any, {
    props: ({ data }) => {
      let taskIdsWithNotifications: string[] | null = null;
      if (data) {
        const response = (data as any).taskIdsWithNotifications;

        if (response) {
          taskIdsWithNotifications = Object.keys(response).map(key => response[key].id);
        }
      }

      return {
        loading: data ? data.loading : false,
        error: data ? data.error : null,
        taskIdsWithNotifications,
      };
    },
  }),
  graphql<IGraphqlProps, IProps, allProps>(getCurrentUserQuery as any, {
    props: ({ data }) => ({
      currentUserLoading: data ? data.loading : false,
      currentUserError: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(Tasks);
