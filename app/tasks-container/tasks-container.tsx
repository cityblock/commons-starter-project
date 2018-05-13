import { ApolloError } from 'apollo-client';
import { History } from 'history';
import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { withRouter } from 'react-router';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import {
  getTasksForCurrentUserQuery,
  getTasksForCurrentUserQueryVariables,
  FullTaskFragment,
} from '../graphql/types';
import Tasks, { IPageParams } from '../shared/tasks/tasks';
import { fetchMore } from '../shared/util/fetch-more';
import * as styles from './css/tasks-container.css';

interface IProps {
  mutate?: any;
  location: History.LocationState;
  match: {
    isExact: boolean;
    params: {
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

export class TasksContainer extends React.Component<allProps> {
  title = 'My Tasks';

  componentDidMount() {
    document.title = `${this.title} | Commons`;
  }

  render() {
    const { tasksResponse, match, history } = this.props;
    const taskId = match && match.params.taskId;

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
          fetchMoreTasks={this.props.fetchMoreTasks}
          updatePageParams={updatePageParams}
          loading={this.props.tasksLoading}
          error={this.props.tasksError}
          hasNextPage={hasNextPage}
          hasPreviousPage={hasPreviousPage}
          routeBase={`/tasks`}
          tasks={tasks}
          taskId={taskId || ''}
        />
      </div>
    );
  }
}

const getPageParams = (props: IProps): getTasksForCurrentUserQueryVariables => {
  const pageParams = querystring.parse(props.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || ('priorityDesc' as any),
  };
};

const withQuery = graphql(tasksQuery as any, {
  options: (props: IProps) => ({
    variables: getPageParams(props),
    fetchPolicy: 'cache-and-network',
  }),
  props: ({ data, ownProps }) => ({
    fetchMoreTasks: () =>
      fetchMore<FullTaskFragment>(data as any, getPageParams(ownProps), 'tasksForCurrentUser'),
    tasksLoading: data ? data.loading : false,
    tasksError: data ? data.error : null,
    tasksResponse: data ? (data as any).tasksForCurrentUser : null,
  }),
});

export default compose(withRouter, withQuery)(TasksContainer) as React.ComponentClass<IProps>;
