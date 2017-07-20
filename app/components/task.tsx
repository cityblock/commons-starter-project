import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectTask } from '../actions/task-action';
import TaskComments from '../components/task-comments';
import { DATETIME_FORMAT } from '../config';
import * as styles from '../css/components/task.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import * as taskCompleteMutation from '../graphql/queries/task-complete-mutation.graphql';
import * as taskUncompleteMutation from '../graphql/queries/task-uncomplete-mutation.graphql';
import {
  FullTaskFragment,
  TaskCompleteMutationVariables,
  TaskUncompleteMutationVariables,
} from '../graphql/types';
import { IState as IAppState } from '../store';
import AddTaskFollower from './add-task-follower';
import TaskHamburgerMenu from './task-hamburger-menu';

export interface IProps {
  task?: FullTaskFragment;
  taskId?: string;
  taskLoading?: boolean;
  taskError?: string;
  routeBase: string;
  selectTask: (taskId?: string) => any;
  refetchTask: () => any;
  match?: {
    params: {
      taskId?: string;
    };
  };
  completeTask: (
    options: { variables: TaskCompleteMutationVariables },
  ) => { data: { taskComplete: FullTaskFragment } };
  uncompleteTask: (
    options: { variables: TaskUncompleteMutationVariables },
  ) => { data: { taskComplete: FullTaskFragment } };
  onDelete: (taskId: string) => any;
}

export interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}

export interface IState {
  hamburgerMenuVisible: boolean;
  copySuccessVisible: boolean;
  toggleCompletionError?: string;
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

const COPY_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

class Task extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.reloadTask = this.reloadTask.bind(this);
    this.getPatientName = this.getPatientName.bind(this);
    this.getAssigneeInfo = this.getAssigneeInfo.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getTaskDueDate = this.getTaskDueDate.bind(this);
    this.renderAttachments = this.renderAttachments.bind(this);
    this.renderFollowers = this.renderFollowers.bind(this);
    this.renderTaskCompletionToggle = this.renderTaskCompletionToggle.bind(this);
    this.onClickToggleCompletion = this.onClickToggleCompletion.bind(this);
    this.getTaskPriorityText = this.getTaskPriorityText.bind(this);
    this.onToggleHamburgerMenu = this.onToggleHamburgerMenu.bind(this);
    this.onCopyShareLinkClick = this.onCopyShareLinkClick.bind(this);
    this.clearCopySuccess = this.clearCopySuccess.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);

    this.state = {
      toggleCompletionError: undefined,
      hamburgerMenuVisible: false,
      copySuccessVisible: false,
      deleteConfirmationInProgress: false,
      deleteError: undefined,
    };
  }

  componentWillMount() {
    if (this.props.taskId) {
      this.props.selectTask(this.props.taskId);
    }
  }

  componentWillUnmount() {
    this.props.selectTask(undefined);
  }

  componentWillReceiveProps(nextProps: IProps) {
    if (this.props.taskId !== nextProps.taskId) {
      this.props.selectTask(nextProps.taskId);
    }
  }

  reloadTask() {
    const { refetchTask } = this.props;

    if (refetchTask) {
      refetchTask();
    }
  }

  async onClickToggleCompletion() {
    const { task, completeTask, uncompleteTask } = this.props;

    try {
      this.setState(() => ({ toggleCompletionError: undefined }));
      if (task && !!task.completedAt) {
        await uncompleteTask({ variables: { taskId: task.id } });
      } else if (task) {
        await completeTask({ variables: { taskId: task.id } });
      }
    } catch (err) {
      this.setState(() => ({ toggleCompletionError: err.message }));
    }
  }

  getPatientName() {
    const { task } = this.props;

    if (task) {
      const { patient } = task;

      return `${patient ? patient.firstName : 'Unknown'} ${patient ? patient.lastName : 'Unknown'}`;
    } else {
      return 'No Patient';
    }
  }

  getAssigneeInfo(): IAssigneeInfo {
    const { task } = this.props;

    if (task && task.assignedTo) {
      return {
        avatar: task.assignedTo.googleProfileImageUrl || DEFAULT_AVATAR_URL,
        name: `${task.assignedTo.firstName} ${task.assignedTo.lastName}`,
        role: task.assignedTo.userRole || 'Unknown Role',
      };
    } else {
      return {
        avatar: DEFAULT_AVATAR_URL,
        name: 'Unknown Assignee',
        role: 'Unknown Role',
      };
    }
  }

  formatDate(date: string) {
    return moment(date, DATETIME_FORMAT).format('MMM D, YYYY');
  }

  getTaskDueDate() {
    const { task } = this.props;

    if (task && task.dueAt) {
      return this.formatDate(task.dueAt);
    } else {
      return 'Unknown Due Date';
    }
  }

  renderAttachments() {
    const { task } = this.props;

    // TODO: update this once attachments are a thing
    if (task && (task as any).attachments) {
      const attachmentsHtml = ((task as any).attachments || []).map((attachment: any) => (
        <div className={styles.attachment}>{attachment.title}</div>
      ));
      return (
        <div className={styles.attachments}>
          {attachmentsHtml}
        </div>
      );
    } else {
      return (
        <div className={styles.emptyAttachments}></div>
      );
    }
  }

  renderFollowers() {
    const { task } = this.props;

    if (task) {
      const followersHtml = (task.followers || []).map(follower => (
        <div
          key={follower.id}
          className={styles.avatar}
          style={{
            backgroundImage: `url('${follower.googleProfileImageUrl || DEFAULT_AVATAR_URL}')`,
          }}>
        </div>
      ));

      return (
        <div className={styles.taskFollowers}>
          <div className={styles.smallText}>Followers</div>
          <div className={styles.followersList}>
            {followersHtml}
            <AddTaskFollower
              taskId={task.id}
              followers={task.followers}
              patientId={task.patientId} />
          </div>
        </div>
      );
    }
  }

  renderTaskCompletionToggle() {
    const { task } = this.props;
    const { toggleCompletionError } = this.state;

    let displayText: string = '';

    if (task) {
      displayText = !!task.completedAt ? 'Task complete' : 'Mark complete';
    } else {
      displayText = 'Mark complete';
    }

    const completionStyles = classNames(styles.markCompletion, {
      [styles.completedIcon]: task && !!task.completedAt,
    });
    const completionErrorStyles = classNames(styles.markCompletionError, {
      [styles.hidden]: !toggleCompletionError,
    });

    return (
      <div className={completionStyles} onClick={this.onClickToggleCompletion}>
        <div className={completionErrorStyles}>
          <div className={classNames(styles.smallText, styles.redText)}>Error updating.</div>
          <div className={styles.smallText}>Please try again.</div>
        </div>
        <div className={styles.markCompletionText}>{displayText}</div>
        <div className={styles.markCompletionIcon}></div>
      </div>
    );
  }

  getTaskPriorityText() {
    const { task } = this.props;

    if (task && task.priority) {
      return task.priority.charAt(0).toUpperCase() + task.priority.slice(1);
    } else {
      return 'Low';
    }
  }

  onToggleHamburgerMenu() {
    const { hamburgerMenuVisible } = this.state;

    this.setState(() => ({ hamburgerMenuVisible: !hamburgerMenuVisible }));
  }

  onCopyShareLinkClick() {
    this.setState(() => ({ hamburgerMenuVisible: false, copySuccessVisible: true }));
    setTimeout(this.clearCopySuccess, COPY_SUCCESS_TIMEOUT_MILLISECONDS);
  }

  clearCopySuccess() {
    this.setState(() => ({ copySuccessVisible: false }));
  }

  onClickDelete() {
    const { taskId } = this.props;

    if (taskId) {
      this.setState(() => ({ hamburgerMenuVisible: false, deleteConfirmationInProgress: true }));
    }
  }

  async onConfirmDelete() {
    const { onDelete, taskId } = this.props;

    if (taskId) {
      try {
        this.setState(() => ({ deleteError: undefined }));
        await onDelete(taskId);
        this.setState(() => ({ deleteConfirmationInProgress: false }));
      } catch (err) {
        this.setState(() => ({ deleteError: err.message }));
      }
    }
  }

  onCancelDelete() {
    this.setState(() => ({ deleteError: undefined, deleteConfirmationInProgress: false }));
  }

  render() {
    const { task, routeBase } = this.props;
    const {
      hamburgerMenuVisible,
      copySuccessVisible,
      deleteConfirmationInProgress,
      deleteError,
    } = this.state;

    const patientName = this.getPatientName();
    const assigneeInfo = this.getAssigneeInfo();
    const dueDate = this.getTaskDueDate();

    const priorityIconStyles = classNames(styles.priorityIcon, {
      [styles.mediumPriorityIcon]: (task && task.priority === 'medium'),
      [styles.highPriorityIcon]: (task && task.priority === 'high'),
    });

    const copySuccessStyles = classNames(styles.copySuccess, {
      [styles.visible]: copySuccessVisible,
    });
    const outerContainerStyles = classNames(styles.container, {
      [styles.deleteConfirmationContainer]: deleteConfirmationInProgress,
    });
    const taskContainerStyles = classNames(styles.taskContainer, {
      [styles.hidden]: deleteConfirmationInProgress,
    });
    const deleteConfirmationStyles = classNames(styles.deleteConfirmation, {
      [styles.hidden]: !deleteConfirmationInProgress,
    });
    const deleteErrorStyles = classNames(styles.deleteError, {
      [styles.hidden]: !deleteConfirmationInProgress || !deleteError,
    });

    const closeRoute = routeBase || '/patients';

    if (task) {
      return (
        <div className={outerContainerStyles}>
          <div className={deleteConfirmationStyles}>
            <div className={styles.deleteConfirmationIcon}></div>
            <div className={styles.deleteConfirmationText}>
              Are you ure you want to delete this task?
            </div>
            <div className={styles.deleteConfirmationSubtext}>
              Deleting this task will completely remove it from this patient's record.
            </div>
            <div className={styles.deleteConfirmationButtons}>
              <div
                className={classNames(styles.deleteCancelButton, styles.invertedButton)}
                onClick={this.onCancelDelete}>
                Cancel
              </div>
              <div
                className={styles.deleteConfirmButton}
                onClick={this.onConfirmDelete}>
                Yes, delete
              </div>
            </div>
            <div className={deleteErrorStyles}>
              <div className={classNames(styles.redText, styles.smallText)}>
                Error deleting task.
              </div>
              <div className={styles.smallText}>Please try again.</div>
            </div>
          </div>
          <div className={taskContainerStyles}>
            <div className={styles.taskHeader}>
              <div className={styles.infoRow}>
                <div className={styles.patientInfo}>
                  <div
                    className={styles.avatar}
                    style={{ backgroundImage: `url('${DEFAULT_AVATAR_URL}')`}}>
                  </div>
                  <Link to={`/patients/${task.patientId}`} className={styles.name}>
                    {patientName}
                  </Link>
                </div>
                <div className={styles.controls}>
                  <div className={copySuccessStyles}>Copied to clipboard</div>
                  <div className={styles.hamburger} onClick={this.onToggleHamburgerMenu}></div>
                  <TaskHamburgerMenu
                    visible={hamburgerMenuVisible}
                    onClickAddAttachment={() => (false)}
                    onClickDelete={this.onClickDelete}
                    onCopy={this.onCopyShareLinkClick}
                    taskId={task.id}
                    patientId={task.patientId} />
                  <Link to={closeRoute} className={styles.close} />
                </div>
              </div>
              <div className={styles.infoRow}>
                <div className={styles.dueDate}>
                  <div className={styles.dueDateIcon}></div>
                  <div className={styles.dueDateText}>{dueDate}</div>
                </div>
                {this.renderTaskCompletionToggle()}
              </div>
              <div className={styles.infoRowLeft}>
                <div className={styles.assignee}>
                  <div
                    className={styles.avatar}
                    style={{ backgroundImage: `url('${assigneeInfo.avatar}')` }}>
                  </div>
                  <div className={styles.name}>{assigneeInfo.name}</div>
                  <div className={styles.smallText}>{assigneeInfo.role}</div>
                </div>
              </div>
            </div>
            <div className={styles.taskBody}>
              <div className={styles.largeText}>{task.title}</div>
              <div className={styles.okrInfo}>
                <div className={styles.okrRow}>
                  <div className={styles.smallText}>Objective:</div>
                  <div className={styles.darkSmallText}>Decrease hemoglobin A1C to below 8%</div>
                </div>
                <div className={styles.okrRow}>
                  <div className={styles.smallText}>Key result:</div>
                  <div className={styles.darkSmallText}>
                    Get patient new prescription for Metformin
                  </div>
                </div>
              </div>
              <div className={styles.bodyText}>{task.description}</div>
              {this.renderAttachments()}
              <div className={classNames(styles.infoRow, styles.borderTop)}>
                <div className={styles.priorityInfo}>
                  <div className={priorityIconStyles}></div>
                  <div className={styles.priorityText}>{this.getTaskPriorityText()} priority</div>
                </div>
                <div className={styles.typeInfo}>
                  <div className={styles.typeIcon}></div>
                  <div className={styles.typeText}>Prescription</div>
                </div>
              </div>
            </div>
            {this.renderFollowers()}
            <TaskComments taskId={task.id} />
          </div>
        </div>
      );
    } else {
      const { taskLoading, taskError } = this.props;

      if (taskLoading) {
        return (
          <div className={styles.container}>
            <div className={styles.loading}>Loading...</div>
          </div>
        );
      } else if (!!taskError) {
        return (
          <div className={styles.container}>
            <div className={styles.loadingError}>
              <div className={styles.loadingErrorIcon}></div>
              <div className={styles.loadingErrorLabel}>Unable to load task</div>
              <div className={styles.loadingErrorSubheading}>
                Sorry, something went wrong. Please try again.
              </div>
              <div
                className={classNames(styles.loadingErrorButton, styles.invertedButton)}
                onClick={this.reloadTask}>
                Try again
              </div>
            </div>
          </div>
        );
      } else {
        return <div className={styles.container}></div>;
      }
    }
  }
}

function mapStateToProps(state: IAppState, ownProps: IProps): Partial<IProps> {
  return {
    taskId: ownProps.match ? ownProps.match.params.taskId : undefined,
  };
}

function mapDispatchToProps(dispatch: Dispatch<() => void>): Partial<IProps> {
  return {
    selectTask: (taskId?: string) => dispatch(selectTask(taskId)),
  };
}

export default (compose as any)(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(taskCompleteMutation as any, { name: 'completeTask' }),
  graphql(taskUncompleteMutation as any, { name: 'uncompleteTask' }),
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: (data ? data.loading : false),
      taskError: (data ? data.error : null),
      task: (data ? (data as any).task : null),
      refetchTask: (data ? data.refetch : null),
    }),
  }),
)(Task);
