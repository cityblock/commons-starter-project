import * as classNames from 'classnames';
import { pickBy } from 'lodash-es';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { getTasksForCurrentUserQuery, FullTaskFragment } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import Tasks, { IPageParams } from '../shared/tasks/tasks';
import { fetchMore } from '../shared/util/fetch-more';
import { IState as IAppState } from '../store';
import * as styles from './css/tasks-container.css';

interface IProps {
  mutate?: any;
  match?: {
    params: {
      taskId: string | null;
    };
  };
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

interface IDispatchProps {
  updatePageParams: (pageParams: IPageParams) => any;
}

type allProps = IProps & IGraphqlProps & IStateProps & IDispatchProps;

class TasksContainer extends React.Component<allProps> {
  componentWillReceiveProps() {
    document.title = `My Tasks | Commons`;
  }

  render() {
    const { tasksResponse, notificationsCount, match } = this.props;
    const taskId = match && match.params.taskId;

    const tasks =
      tasksResponse && tasksResponse.edges ? tasksResponse.edges.map((edge: any) => edge.node) : [];
    const hasNextPage = tasksResponse ? tasksResponse.pageInfo.hasNextPage : false;
    const hasPreviousPage = tasksResponse ? tasksResponse.pageInfo.hasPreviousPage : false;

    const tasksTabStyles = classNames(tabStyles.tab, tabStyles.selectedTab);
    const tasksPaneStyles = classNames(tabStyles.pane, tabStyles.selectedPane);

    const calendarTabStyles = tabStyles.tab;
    const calendarPaneStyles = tabStyles.pane;

    const notificationsTabStyles = classNames(tabStyles.tab, tabStyles.relativeTab);
    const notificationsBadgeStyles = classNames(tabStyles.notificationBadge, {
      [tabStyles.visible]: notificationsCount > 0,
    });

    return (
      <div className={styles.container}>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id="tasks.listView">
              {(message: string) => (
                <Link className={tasksTabStyles} to={'/tasks'}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <FormattedMessage id="tasks.calendar">
              {(message: string) => (
                <Link className={calendarTabStyles} to={'/calendar'}>
                  {message}
                </Link>
              )}
            </FormattedMessage>
            <Link className={notificationsTabStyles} to={'/notifications/tasks'}>
              <FormattedMessage id="tasks.notifications">
                {(message: string) => <span>{message}</span>}
              </FormattedMessage>
              <div className={notificationsBadgeStyles} />
            </Link>
          </div>
          <div className={tasksPaneStyles}>
            <Tasks
              fetchMoreTasks={this.props.fetchMoreTasks}
              updatePageParams={this.props.updatePageParams}
              loading={this.props.tasksLoading}
              error={this.props.tasksError}
              hasNextPage={hasNextPage}
              hasPreviousPage={hasPreviousPage}
              routeBase={`/tasks`}
              tasks={tasks}
              taskId={taskId || ''}
            />
          </div>
          <div className={calendarPaneStyles}>calendar!</div>
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

function mapDispatchToProps(dispatch: Dispatch<() => void>): IDispatchProps {
  return {
    updatePageParams: (pageParams: IPageParams) => {
      const cleanedPageParams = pickBy<IPageParams>(pageParams);
      dispatch(push({ search: querystring.stringify(cleanedPageParams) }));
    },
  };
}

const getPageParams = (props: IProps) => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    pageNumber: 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
  };
};

export default compose(
  connect<IStateProps, IDispatchProps>(
    mapStateToProps as (args?: any) => IStateProps,
    mapDispatchToProps,
  ),
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
