import { ApolloError } from 'apollo-client';
import { History } from 'history';
import querystring from 'querystring';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import getCurrentUserGraphql from '../../graphql/queries/get-current-user.graphql';
import taskIdsWithNotificationsGraphql from '../../graphql/queries/get-task-ids-with-notifications.graphql';
import taskDeleteGraphql from '../../graphql/queries/task-delete-mutation.graphql';
import {
  getTaskIdsWithNotifications,
  taskDelete,
  taskDeleteVariables,
  FullPatientGoal,
  FullTask,
  FullUser,
} from '../../graphql/types';
import { TasksTab } from '../../tasks-container/tasks-container';
import sortSearchStyles from '../css/sort-search.css';
import InfiniteScroll from '../infinite-scroll/infinite-scroll';
import Option from '../library/option/option';
import Select from '../library/select/select';
import Text from '../library/text/text';
import UnderlineTab from '../library/underline-tab/underline-tab';
import UnderlineTabs from '../library/underline-tabs/underline-tabs';
import Task from '../task/task';
import styles from './css/tasks.css';
import TaskRow from './task-row';
import { TasksLoadingError } from './tasks-loading-error';

type OrderByOptions = 'priorityDesc' | 'dueAtAsc' | 'patientAsc';

export interface IPageParams {
  orderBy: OrderByOptions;
}

export interface IProps {
  routeBase: string;
  patientGoals?: FullPatientGoal[];
  tasks?: FullTask[];
  loading?: boolean;
  error?: ApolloError | null;
  updatePageParams: (params: IPageParams) => any;
  fetchMoreTasks: () => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
  taskId: string;
  taskIdsWithNotifications?: string[];
  tab: TasksTab;
}

interface IRouterProps {
  history: History;
}

interface IGraphqlProps {
  deleteTask: (options: { variables: taskDeleteVariables }) => { data: taskDelete };
  taskIdsWithNotifications?: getTaskIdsWithNotifications['taskIdsWithNotifications'];
  currentUser: FullUser;
  currentUserLoading?: boolean;
  currentUserError?: string | null;
}

interface IState {
  orderBy: OrderByOptions;
  loading?: boolean;
  error?: ApolloError | null;
}

type allProps = IProps & IGraphqlProps & IRouterProps;

const getPageParams = () => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'priorityDesc',
  };
};

export class Tasks extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: allProps) {
    const { loading, error } = nextProps;
    const pageParams = getPageParams();

    return { loading, error, orderBy: pageParams.orderBy || 'priorityDesc' };
  }

  state = {
    orderBy: 'priorityDesc' as OrderByOptions,
    error: null,
    pageNumber: 0,
  };

  renderTasks(tasks: FullTask[]) {
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

  renderTask = (task: FullTask) => {
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
      tab,
    } = this.props;

    const { orderBy } = this.state;
    const tasksList = tasks || [];

    const RenderedTask = (props: any) => (
      <Task
        routeBase={`${routeBase}?${window.location.search.substring(1)}`}
        onDelete={this.onDeleteTask}
        patientGoals={patientGoals}
        taskId={taskId}
        {...props}
      />
    );
    const taskHtml = <Route path={`${routeBase}/:taskId`} render={RenderedTask} />;
    return (
      <div className={styles.container}>
        <UnderlineTabs>
          <div>
            <UnderlineTab
              messageId="myTasks.assigned"
              selected={tab === 'assigned'}
              href={`/tasks/assigned/${window.location.search}`}
            />
            <UnderlineTab
              messageId="myTasks.following"
              selected={tab === 'following'}
              href={`/tasks/following/${window.location.search}`}
            />
          </div>
          <div className={sortSearchStyles.sort}>
            <Text
              messageId="myTasks.sortBy"
              color="darkGray"
              size="large"
              className={sortSearchStyles.label}
            />
            <Select
              value={orderBy}
              onChange={this.onSortChange}
              className={sortSearchStyles.dropdown}
            >
              <Option value="priorityDesc" messageId="myTasks.priority" />
              <Option value="dueAtAsc" messageId="myTasks.dueAt" />
              <Option value="patientAsc" messageId="myTasks.patient" />
            </Select>
          </div>
        </UnderlineTabs>
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
          {taskHtml}
        </div>
      </div>
    );
  }
}

export default compose(
  withRouter,
  graphql<IGraphqlProps>(taskDeleteGraphql, { name: 'deleteTask' }),
  graphql(taskIdsWithNotificationsGraphql, {
    options: { fetchPolicy: 'network-only' },
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
  graphql(getCurrentUserGraphql, {
    options: { fetchPolicy: 'network-only' },
    props: ({ data }) => ({
      currentUserLoading: data ? data.loading : false,
      currentUserError: data ? data.error : null,
      currentUser: data ? (data as any).currentUser : null,
    }),
  }),
)(Tasks) as React.ComponentClass<IProps>;
