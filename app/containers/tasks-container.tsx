import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import { connect, Dispatch } from 'react-redux';
import { push } from 'react-router-redux';
import Tasks from '../components/tasks';
import * as styles from '../css/components/tasks-container.css';
import * as tabStyles from '../css/shared/tabs.css';
import * as tasksQuery from '../graphql/queries/tasks-for-current-user.graphql';
import { ShortTaskFragment } from '../graphql/types';
import { getPageParams } from '../util/page-params';

export interface IProps {
  intl: InjectedIntl;
  tasksLoading: boolean;
  tasksError?: string;
  tasks: ShortTaskFragment[];
  refetchTasks: () => any;
  updatePageParamsPage: (pageNumber: number) => any;
  updatePageParams: (tab: string) => any;
}

type SelectableTabs = 'tasks' | 'calendar';

export interface IState {
  selectedTab: SelectableTabs;
}

class TasksContainer extends React.Component<IProps, IState> {

  constructor(props: IProps) {
    super(props);

    this.onTabClick = this.onTabClick.bind(this);

    const { tab } = getPageParams();

    this.state = {
      selectedTab: tab || 'tasks',
    };
  }

  componentWillReceiveProps(newProps: IProps) {
    const { tab } = getPageParams();
    this.setState(() => ({ selectedTab: tab || 'tasks' }));

    document.title = `My Tasks | Commons`;
  }

  onTabClick(selectedTab: SelectableTabs) {
    const { updatePageParams } = this.props;

    updatePageParams(selectedTab);
    this.setState(() => ({ selectedTab }));
  }

  render() {
    const { selectedTab } = this.state;

    const tasksTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: selectedTab === 'tasks',
    });
    const tasksPaneStyles = classNames(tabStyles.pane, {
      [tabStyles.selectedPane]: selectedTab === 'tasks',
    });
    const calendarTabStyles = classNames(tabStyles.tab, {
      [tabStyles.selectedTab]: selectedTab === 'calendar',
    });
    const calendarPaneStyles = classNames(tabStyles.pane, {
      [tabStyles.selectedPane]: selectedTab === 'calendar',
    });
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
                <div
                  className={tasksTabStyles}
                  onClick={() => this.onTabClick('tasks')}>
                  {message}
                </div>}
            </FormattedMessage>
            <FormattedMessage id='tasks.calendar'>
              {(message: string) =>
                <div
                  className={calendarTabStyles}
                  onClick={() => this.onTabClick('calendar')}>
                  {message}
                </div>}
            </FormattedMessage>
          </div>
          <div className={tasksPaneStyles}>
            <Tasks
              updatePageParams={this.props.updatePageParamsPage}
              refetchTasks={this.props.refetchTasks}
              loading={this.props.tasksLoading}
              error={this.props.tasksError}
              tasks={this.props.tasks} />
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
    updatePageParams: (tab: string) => {
      dispatch(push({ search: querystring.stringify({ tab }) }));
    },
    updatePageParamsPage: (pageNumber: number) => {
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
      tasks: (data ? (data as any).tasksUserFollowing : null),
    }),
  }),
)(TasksContainer);
