import * as classNames from 'classnames';
import { pickBy } from 'lodash';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { GetTasksForCurrentUserQuery } from '../graphql/types';
import * as tabStyles from '../shared/css/tabs.css';
import Tasks, { IPageParams } from '../shared/tasks';
import { fetchMoreTasks } from '../shared/util/fetch-more-tasks';
import * as styles from './css/tasks-container.css';

export interface IProps {
  intl: InjectedIntl;
  tasksLoading: boolean;
  tasksError?: string;
  tasksResponse?: GetTasksForCurrentUserQuery['tasksForCurrentUser'];
  fetchMoreTasks: () => any;
  updatePageParams: (pageParams: IPageParams) => any;
}

class TasksContainer extends React.Component<IProps> {

  componentWillReceiveProps(newProps: IProps) {
    document.title = `My Tasks | Commons`;
  }

  render() {
    const { tasksResponse } = this.props;

    const tasks = tasksResponse && tasksResponse.edges
      ? tasksResponse.edges.map((edge: any) => edge.node) : [];
    const hasNextPage = tasksResponse ? tasksResponse.pageInfo.hasNextPage : false;
    const hasPreviousPage = tasksResponse ? tasksResponse.pageInfo.hasPreviousPage : false;

    const tasksTabStyles = classNames(tabStyles.tab, tabStyles.selectedTab);
    const tasksPaneStyles = classNames(tabStyles.pane, tabStyles.selectedPane);

    const calendarTabStyles = tabStyles.tab;
    const calendarPaneStyles = tabStyles.pane;
    return (
      <div className={styles.container}>
        <div className={styles.leftPane}>
          <FormattedMessage id='tasks.tasksList'>
            {(message: string) =>
              <div className={styles.leftHeading}>{message}</div>}
          </FormattedMessage>
        </div>
        <div className={styles.mainBody}>
          <div className={tabStyles.tabs}>
            <FormattedMessage id='tasks.listView'>
              {(message: string) =>
                <Link
                  className={tasksTabStyles}
                  to={`/tasks`}>
                  {message}
                </Link>}
            </FormattedMessage>
            <FormattedMessage id='tasks.calendar'>
              {(message: string) =>
                <Link
                  className={calendarTabStyles}
                  to={`/calendar`}>
                  {message}
                </Link>}
            </FormattedMessage>
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
              tasks={tasks} />
          </div>
          <div className={calendarPaneStyles}>
            calendar!
          </div>
        </div>
      </div>
    );
  }
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    updatePageParams: (pageParams: IPageParams) => {
      const cleanedPageParams = pickBy<IPageParams, {}>(pageParams);
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
  injectIntl,
  connect(undefined, mapDispatchToProps),
  graphql(tasksQuery as any, {
    options: (props: IProps) => ({ variables: getPageParams(props) }),
    props: ({ data, ownProps }) => ({
      fetchMoreTasks: () =>
        fetchMoreTasks(data as any, getPageParams(ownProps), 'tasksForCurrentUser'),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasksResponse: (data ? (data as any).tasksForCurrentUser : null),
    }),
  }),
)(TasksContainer);
