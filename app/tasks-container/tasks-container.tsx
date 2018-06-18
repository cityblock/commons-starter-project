import { ApolloError } from 'apollo-client';
import { History } from 'history';
import { pickBy } from 'lodash';
import querystring from 'querystring';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import {
  getTasksForCurrentUserQuery,
  getTasksForCurrentUserQueryVariables,
  FullTaskFragment,
} from '../graphql/types';
import Tasks, { IPageParams } from '../shared/tasks/tasks';
import { fetchMore } from '../shared/util/fetch-more';
import styles from './css/tasks-container.css';

export type TasksTab = 'assigned' | 'following';

interface IProps {
  mutate?: any;
  location: History.LocationState;
  match: {
    isExact: boolean;
    params: {
      tab: TasksTab;
      taskId: string;
    };
    path: string;
    url: string;
  };
  history: History;
}

interface IGraphqlProps {
  tasksLoading: boolean;
  tasksError?: ApolloError | null;
  tasksResponse?: getTasksForCurrentUserQuery['tasksForCurrentUser'];
  fetchMoreTasks: () => any;
}

type allProps = IProps & IGraphqlProps;

export const TasksContainer = (props: allProps) => {
  const { tasksResponse, match, history, fetchMoreTasks, tasksError, tasksLoading } = props;
  const taskId = match && match.params.taskId;
  const tab = match ? match.params.tab : 'assigned';

  const tasks =
    tasksResponse && tasksResponse.edges ? tasksResponse.edges.map((edge: any) => edge.node) : [];
  const hasNextPage = tasksResponse ? tasksResponse.pageInfo.hasNextPage : false;
  const hasPreviousPage = tasksResponse ? tasksResponse.pageInfo.hasPreviousPage : false;

  const updatePageParams = (pageParams: IPageParams) => {
    const cleanedPageParams = pickBy<IPageParams>(pageParams);
    history.push({ search: querystring.stringify(cleanedPageParams) });
  };

  return (
    <div className={styles.container}>
      <Tasks
        fetchMoreTasks={fetchMoreTasks}
        updatePageParams={updatePageParams}
        loading={tasksLoading}
        error={tasksError}
        hasNextPage={hasNextPage}
        hasPreviousPage={hasPreviousPage}
        routeBase={`/tasks/${tab}`}
        tasks={tasks}
        taskId={taskId || ''}
        tab={tab}
      />
    </div>
  );
};

const getPageParams = (props: IProps): getTasksForCurrentUserQueryVariables => {
  const pageParams = querystring.parse(props.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || ('priorityDesc' as any),
    isFollowingTasks: props.match ? props.match.params.tab === 'following' : false,
  };
};

const withQuery = graphql(tasksQuery, {
  options: (props: IProps) => ({
    variables: getPageParams(props),
  }),
  props: ({ data, ownProps }) => ({
    fetchMoreTasks: () =>
      fetchMore<FullTaskFragment>(data as any, getPageParams(ownProps), 'tasksForCurrentUser'),
    tasksLoading: data ? data.loading : false,
    tasksError: data ? data.error : null,
    tasksResponse: data ? (data as any).tasksForCurrentUser : null,
  }),
});

export default compose(
  withRouter,
  withQuery,
)(TasksContainer) as React.ComponentClass<IProps>;
