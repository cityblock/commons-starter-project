import { History } from 'history';
import { pickBy } from 'lodash-es';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { getTasksForCurrentUserQuery, FullTaskFragment } from '../graphql/types';
import UnderlineTab from '../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../shared/library/underline-tabs/underline-tabs';
import Tasks, { IPageParams } from '../shared/tasks/tasks';
import { fetchMore } from '../shared/util/fetch-more';
import { IState as IAppState } from '../store';
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
  tasksError: string | null;
  tasksResponse?: getTasksForCurrentUserQuery['tasksForCurrentUser'];
  fetchMoreTasks: () => any;
}

interface IStateProps {
  notificationsCount: number;
}

type allProps = IProps & IGraphqlProps & IStateProps;

class TasksContainer extends React.Component<allProps> {
  componentWillReceiveProps() {
    document.title = `My Tasks | Commons`;
  }

  render() {
    const { tasksResponse, notificationsCount, match, history } = this.props;
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
        <div className={styles.mainBody}>
          <UnderlineTabs color="white">
            <UnderlineTab messageId="tasks.listView" href={'/tasks'} selected={true} />
            <UnderlineTab
              messageId="tasks.notifications"
              href={'/notifications/tasks'}
              selected={false}
              displayNotificationBadge={notificationsCount > 0}
            />
          </UnderlineTabs>
          <div>
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
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): IStateProps {
  return {
    notificationsCount: state.eventNotifications.count,
  };
}

const getPageParams = (props: IProps) => {
  const pageParams = querystring.parse(props.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
  };
};

export default compose(
  withRouter,
  connect<IStateProps, {}>(mapStateToProps as (args?: any) => IStateProps),
  graphql<IGraphqlProps, IProps, allProps>(tasksQuery as any, {
    options: (props: IProps) => ({ variables: getPageParams(props) }),
    props: ({ data, ownProps }) => ({
      fetchMoreTasks: () =>
        fetchMore<FullTaskFragment>(data as any, getPageParams(ownProps), 'tasksForCurrentUser'),
      tasksLoading: data ? data.loading : false,
      tasksError: data ? data.error : null,
      tasksResponse: data ? (data as any).tasksForCurrentUser : null,
    }),
  }),
)(TasksContainer);
