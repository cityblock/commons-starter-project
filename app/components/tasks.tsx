import * as classNames from 'classnames';
import * as querystring from 'querystring';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { connect } from 'react-redux';
import { Route } from 'react-router-dom';
import * as styles from '../css/components/tasks.css';
import * as sortSearchStyles from '../css/shared/sort-search.css';
import { ShortPatientFragment, ShortTaskFragment } from '../graphql/types';
import { IState as IAppState } from '../store';
import { Pagination } from './pagination';
import Task from './task';
import TaskCreate from './task-create';
import { TaskRow } from './task-row';
import { TasksLoadingError } from './tasks-loading-error';

export type OrderByOptions = 'createdAtDesc' | 'createdAtAsc' | 'dueAtAsc' | 'updatedAtAsc';

export interface IPageParams {
  pageNumber: number;
  taskId?: string;
  orderBy: OrderByOptions;
}

export interface ITaskPageInfo {
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface IProps {
  taskId?: string;
  routeBase: string;
  patient?: ShortPatientFragment;
  tasks?: ShortTaskFragment[];
  refetchTasks: (variables: { pageNumber: number, orderBy: string }) => any;
  loading?: boolean;
  error?: string;
  updatePageParams: (params: IPageParams) => any;
  hasNextPage?: boolean;
  hasPreviousPage?: boolean;
}

export interface IState extends IPageParams {
  loading?: boolean;
  error?: string;
  showCreateTask?: boolean;
  orderBy: OrderByOptions;
}

const getPageParams = () => {
  const pageParams = querystring.parse(window.location.search.substring(1));

  return {
    pageNumber: pageParams.pageNumber || 0,
    pageSize: 10,
    orderBy: pageParams.orderBy || 'createdAtDesc',
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
    this.showCreateTask = this.showCreateTask.bind(this);
    this.hideCreateTask = this.hideCreateTask.bind(this);
    this.onSortChange = this.onSortChange.bind(this);

    const pageParams = getPageParams();

    this.state = {
      loading,
      error,
      pageNumber: pageParams.pageNumber || 0,
      orderBy: (pageParams.orderBy as any) || 'createdAtDesc',
    };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { loading, error } = nextProps;

    this.setState(() => ({ loading, error }));
  }

  showCreateTask() {
    this.setState(() => ({ showCreateTask: true }));
  }

  hideCreateTask() {
    this.setState(() => ({ showCreateTask: false }));
    this.props.refetchTasks({
      pageNumber: this.state.pageNumber,
      orderBy: this.state.orderBy,
    });
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

  onSortChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value as OrderByOptions;
    this.setState({
      pageNumber: 0,
      orderBy: value,
    });
    this.props.updatePageParams({ pageNumber: 0, orderBy: value });
  }

  async reloadTasks() {
    const { refetchTasks } = this.props;

    if (refetchTasks) {
      try {
        this.setState(() => ({ loading: true, error: undefined }));
        await refetchTasks({
          pageNumber: this.state.pageNumber,
          orderBy: this.state.orderBy,
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
        orderBy: this.state.orderBy,
      });

      this.props.updatePageParams({ pageNumber: 0, orderBy: this.state.orderBy });
      this.setState((state: IState) => ({ pageNumber }));
    }
  }

  async getPreviousPage() {
    if (this.props.hasPreviousPage) {
      const pageNumber = this.state.pageNumber - 1;

      await this.props.refetchTasks({
        pageNumber,
        orderBy: this.state.orderBy,
      });

      this.props.updatePageParams({ pageNumber: 0, orderBy: this.state.orderBy });
      this.setState((state: IState) => ({ pageNumber }));
    }
  }

  render() {
    const { tasks, routeBase, taskId } = this.props;
    const { orderBy } = this.state;
    const tasksList = tasks || [];
    const taskListStyles = classNames(styles.tasksList, {
      [styles.emptyTasksList]: !tasksList.length,
    });
    const taskContainerStyles = classNames(styles.taskContainer, {
      [styles.taskContainerVisible]: !!taskId || this.state.showCreateTask,
    });
    const createTaskButton = this.props.patient ? (
      <div className={styles.createContainer}>
        <FormattedMessage id='tasks.createTask'>
          {(message: string) => <div
            onClick={this.showCreateTask}
            className={styles.createButton}>{message}</div>}
        </FormattedMessage>
      </div>
    ) : null;
    const createTaskHtml = this.props.patient && this.state.showCreateTask ? (
      <TaskCreate patient={this.props.patient} onClose={this.hideCreateTask} />
    ) : null;
    const taskHtml = this.state.showCreateTask ?
      null : (<Route path={`${routeBase}/:taskId`} component={Task} />);
    return (
      <div className={styles.container}>
        <div className={sortSearchStyles.sortSearchBar}>
          <div className={sortSearchStyles.sort}>
            <div className={sortSearchStyles.sortLabel}>Sort by:</div>
            <div className={sortSearchStyles.sortDropdown}>
              <select value={orderBy} onChange={this.onSortChange}>
                <option value='createdAtAsc'>Newest first</option>
                <option value='createdAtDesc'>Oldest first</option>
                <option value='dueAtAsc'>Due soonest</option>
                <option value='dueAtDesc'>Due latest</option>
                <option value='updatedAtAsc'>Last updated</option>
                <option value='updatedAtDesc'>Last updated desc</option>
              </select>
            </div>
            <div className={classNames(sortSearchStyles.search, styles.search)}>
              <input required type='text' placeholder='Search by user or keywords' />
            </div>
          </div>
          {createTaskButton}
        </div>
        <div className={styles.bottomContainer}>
          <div className={styles.taskListContainer}>
            <div className={taskListStyles}>
              {this.renderTasks(tasksList)}
            </div>
            <Pagination
              hasNextPage={this.props.hasNextPage}
              hasPreviousPage={this.props.hasPreviousPage}
              onNextClick={this.getNextPage}
              onPreviousClick={this.getPreviousPage} />
          </div>
          <div className={taskContainerStyles}>
            {taskHtml}
            {createTaskHtml}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: IAppState): Partial<IProps> {
  return {
    taskId: state.task.taskId,
  };
}

export default connect(mapStateToProps)(Tasks as any) as any;
