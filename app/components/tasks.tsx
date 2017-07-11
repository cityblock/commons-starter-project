import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import * as styles from '../css/components/tasks.css';
import * as sortSearchStyles from '../css/shared/sort-search.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import { ShortTaskFragment } from '../graphql/types';
import { Pagination } from './pagination';
import TaskRow from './task-row';
import { TasksLoadingError } from './tasks-loading-error';

export interface IPageParams {
  pageNumber: number;
  pageSize: number;
}

export interface ITaskPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IProps {
  intl: InjectedIntl;
  loading?: boolean;
  error?: string;
  tasks?: ShortTaskFragment[];
  updatePageParams: (pageNumber: number) => any;
  refetchTasks: (variables: { pageNumber: number, pageSize: number }) => any;
}

export interface IState extends IPageParams {
  selectedTaskId: string | null;
  loading?: boolean;
  error?: string;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

const getPageParams = (): IPageParams => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: pageParams.pageSize || 10,
  };
};

class Tasks extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    const { loading, error } = props;

    this.onClickTask = this.onClickTask.bind(this);
    this.renderTasks = this.renderTasks.bind(this);
    this.renderPatientTask = this.renderPatientTask.bind(this);
    this.reloadTasks = this.reloadTasks.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);

    const pageParams = getPageParams();

    this.state = {
      selectedTaskId: null,
      loading,
      error,
      pageNumber: pageParams.pageNumber || 0,
      pageSize: pageParams.pageSize || 10,
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  onClickTask(taskId: string) {
    this.setState((prevState: IState) => {
      const { selectedTaskId } = prevState;

      if (taskId === selectedTaskId) {
        return { selectedTaskId: null };
      } else {
        return { selectedTaskId: taskId };
      }
    });
  }

  renderTasks(tasks: ShortTaskFragment[]) {
    const { loading, error } = this.state;

    if (tasks.length) {
      return tasks.map(this.renderPatientTask);
    } else if (!loading && !error) {
      return (
        <div className={styles.emptyTasksMessage}>
          <div className={styles.emptyTasksLogo}></div>
          <FormattedMessage id='tasks.noTasks'>
            {(message: string) =>
              <div className={styles.emptyTasksLabel}>{message}</div>}
          </FormattedMessage>

        </div>
      );
    } else {
      return (
        <TasksLoadingError
          error={error}
          loading={loading}
          onRetryClick={this.reloadTasks}
        />
      );
    }
  }

  renderPatientTask(task: ShortTaskFragment) {
    const selected = task.id === this.state.selectedTaskId;
    return (
      <TaskRow
        key={task.id}
        task={task}
        selected={selected}
        onClick={this.onClickTask}
      />
    );
  }

  async reloadTasks() {
    const { refetchTasks } = this.props;

    if (refetchTasks) {
      try {
        this.setState(() => ({ loading: true, error: undefined }));
        await refetchTasks({
          pageNumber: this.state.pageNumber,
          pageSize: this.state.pageSize,
        });
      } catch (err) {
        // TODO: This is redundant. Props will get set by the result of the refetch.
        this.setState(() => ({ loading: false, error: err.message }));
      }
    }
  }

  async getNextPage() {
    if (this.state.hasNextPage) {
      const pageNumber = this.state.pageNumber + 1;

      this.props.refetchTasks({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.props.updatePageParams(pageNumber);
      this.setState((state: IState) => ({ pageNumber }));
    }
  }

  async getPreviousPage() {
    if (this.state.hasPreviousPage) {
      const pageNumber = this.state.pageNumber - 1;

      await this.props.refetchTasks({
        pageNumber,
        pageSize: this.state.pageSize,
      });

      this.props.updatePageParams(pageNumber);
      this.setState((state: IState) => ({ pageNumber }));
    }
  }

  render() {
    const { tasks } = this.props;
    const tasksList = tasks || [];
    const taskListStyles = classNames(styles.tasksList, {
      [styles.emptyTasksList]: !tasksList.length,
    });

    return (
      <div className={styles.container}>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value='Newest first'>
                <option value='Newest first'>Newest first</option>
              </select>
            </div>
          </div>
          <div className={sortSearchStyles.search}>
            <input required type='text' placeholder='Search by user or keywords' />
          </div>
        </div>
        <div className={taskListStyles}>
          {this.renderTasks(tasksList)}
        </div>
        <Pagination
          hasNextPage={this.state.hasNextPage}
          hasPreviousPage={this.state.hasPreviousPage}
          onNextClick={this.getNextPage}
          onPreviousClick={this.getPreviousPage} />
      </div>
    );
  }
}

export default compose(
  injectIntl,
  graphql(taskQuery as any, {
    options: (props: IProps) => ({
      variables: {},
    }),
    props: ({ data }) => ({
      refetchTask: (data ? data.refetch : null),
      tasksLoading: (data ? data.loading : false),
      tasksError: (data ? data.error : null),
      tasks: (data ? (data as any).tasksUserFollowing : null),
    }),
  }),
)(Tasks);
