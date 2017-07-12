import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { injectIntl, FormattedMessage, InjectedIntl } from 'react-intl';
import * as styles from '../css/components/tasks.css';
import * as sortSearchStyles from '../css/shared/sort-search.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import { FullTaskFragment, ShortTaskFragment } from '../graphql/types';
import { Pagination } from './pagination';
import { TaskRow } from './task-row';
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
  routeBase: string;
  tasks?: ShortTaskFragment[];
  refetchTasks: (variables: { pageNumber: number, pageSize: number }) => any;
  loading?: boolean;
  error?: string;
  taskId?: string;
  task?: FullTaskFragment;
  taskLoading?: boolean;
  taskError?: string;
  updatePageParams: (pageNumber: number) => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface IState extends IPageParams {
  loading?: boolean;
  error?: string;
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

    this.renderTasks = this.renderTasks.bind(this);
    this.renderTask = this.renderTask.bind(this);
    this.reloadTasks = this.reloadTasks.bind(this);
    this.getNextPage = this.getNextPage.bind(this);
    this.getPreviousPage = this.getPreviousPage.bind(this);

    const pageParams = getPageParams();

    this.state = {
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

  renderTasks(tasks: ShortTaskFragment[]) {
    const { loading, error } = this.state;
    if (tasks.length) {
      return tasks.map(this.renderTask);
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

  renderTask(task: ShortTaskFragment) {
    const selected = task.id === this.props.taskId;
    return (
      <TaskRow
        key={task.id}
        task={task}
        selected={selected}
        routeBase={this.props.routeBase}
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
    if (this.props.hasNextPage) {
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
    if (this.props.hasPreviousPage) {
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
          hasNextPage={this.props.hasNextPage}
          hasPreviousPage={this.props.hasPreviousPage}
          onNextClick={this.getNextPage}
          onPreviousClick={this.getPreviousPage} />
      </div>
    );
  }
}

export default compose(
  injectIntl,
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: (data ? data.loading : false),
      taskError: (data ? data.error : null),
      task: (data ? (data as any).task : null),
    }),
  }),
)(Tasks);
