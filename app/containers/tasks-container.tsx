import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { push } from 'react-router-redux';
import Tasks from '../components/tasks';
import * as styles from '../css/components/tasks-container.css';
import * as tabStyles from '../css/shared/tabs.css';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { ShortTaskFragment } from '../graphql/types';

export interface IProps {
  intl: InjectedIntl;
  tasksLoading: boolean;
  tasksError?: string;
  tasksResponse?: {
    edges: Array<{
      node: ShortTaskFragment;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  refetchTasks: () => any;
  updatePageParams: (pageNumber: number) => any;
}

class TasksContainer extends React.Component<IProps> {

  componentWillReceiveProps(newProps: IProps) {
    document.title = `My Tasks | Commons`;
  }

  render() {
    const { tasksResponse } = this.props;

    const tasks = tasksResponse ? tasksResponse.edges.map((edge: any) => edge.node) : [];
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
              updatePageParams={this.props.updatePageParams}
              refetchTasks={this.props.refetchTasks}
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
    updatePageParams: (pageNumber: number) => {
      const pageParams = getPageParamsPagination();
      pageParams.variables.pageNumber = pageNumber;
      dispatch(push({ search: querystring.stringify(pageParams) }));
    },
  };
}

const getPageParamsPagination = () => {
  const pageParams = querystring.parse(window.location.search.substring(1));
  return {
    variables: {
      pageNumber: pageParams.pageNumber || 0,
      pageSize: pageParams.pageSize || 10,
    },
  };
};
export default compose(
  injectIntl,
  connect(undefined, mapDispatchToProps),
  graphql(tasksQuery as any, {
    options: getPageParamsPagination,
    props: ({ data }) => ({
      refetchTasks: (data ? data.refetch : null),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasksResponse: (data ? (data as any).tasksForCurrentUser : null),
    }),
  }),
)(TasksContainer);
