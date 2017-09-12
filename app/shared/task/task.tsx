import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { selectTask } from '../../actions/task-action';
import { DATETIME_FORMAT } from '../../config';
import * as taskQuery from '../../graphql/queries/get-task.graphql';
import * as taskCompleteMutation from '../../graphql/queries/task-complete-mutation.graphql';
import * as taskEditMutation from '../../graphql/queries/task-edit-mutation.graphql';
import * as taskUncompleteMutation from '../../graphql/queries/task-uncomplete-mutation.graphql';
import {
  taskCompleteMutationVariables,
  taskEditMutationVariables,
  taskUncompleteMutationVariables,
  FullPatientGoalFragment,
  FullTaskFragment,
} from '../../graphql/types';
import { IState as IAppState } from '../../store';
import AddTaskFollower from './add-task-follower';
import * as styles from './css/task.css';
import TaskAssignee from './task-assignee';
import TaskComments from './task-comments';
import { TaskHamburgerMenu } from './task-hamburger-menu';
import { TaskMissing } from './task-missing';

export interface IProps {
  task?: FullTaskFragment;
  taskId?: string;
  taskLoading?: boolean;
  taskError?: string;
  routeBase: string;
  patientGoals?: FullPatientGoalFragment[];
  selectTask: (taskId?: string) => any;
  refetchTask: () => any;
  match?: {
    params: {
      taskId?: string;
    };
  };
  completeTask: (
    options: { variables: taskCompleteMutationVariables },
  ) => { data: { taskComplete: FullTaskFragment } };
  uncompleteTask: (
    options: { variables: taskUncompleteMutationVariables },
  ) => { data: { taskUncomplete: FullTaskFragment } };
  editTask: (
    options: { variables: taskEditMutationVariables },
  ) => { data: { taskEdit: FullTaskFragment } };
  onDelete: (taskId: string) => any;
}

export interface IState {
  hamburgerMenuVisible: boolean;
  copySuccessVisible: boolean;
  toggleCompletionError?: string;
  deleteConfirmationInProgress: boolean;
  deleteError?: string;
  changePriorityError?: string;
  changeDueDateError?: string;
  changePatientGoalError?: string;
  editedTitle: string;
  editingTitle: boolean;
  editTitleError?: string;
  editedDescription: string;
  editDescriptionError?: string;
  editingDescription: boolean;
  titleHeight: string;
  descriptionHeight: string;
}

export const DEFAULT_AVATAR_URL = 'https://bit.ly/2weRwJm';

const COPY_SUCCESS_TIMEOUT_MILLISECONDS = 2000;

const BASE_TEXT_HEIGHT = '2px';

export class Task extends React.Component<IProps, IState> {
  editTitleTextArea: HTMLTextAreaElement | null;
  editDescriptionTextArea: HTMLTextAreaElement | null;
  titleBody: HTMLDivElement | null;
  descriptionBody: HTMLDivElement | null;

  constructor(props: IProps) {
    super(props);

    this.reloadTask = this.reloadTask.bind(this);
    this.getPatientName = this.getPatientName.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getTaskDueDate = this.getTaskDueDate.bind(this);
    this.renderAttachments = this.renderAttachments.bind(this);
    this.renderFollowers = this.renderFollowers.bind(this);
    this.renderTaskCompletionToggle = this.renderTaskCompletionToggle.bind(this);
    this.onClickToggleCompletion = this.onClickToggleCompletion.bind(this);
    this.onToggleHamburgerMenu = this.onToggleHamburgerMenu.bind(this);
    this.onCopyShareLinkClick = this.onCopyShareLinkClick.bind(this);
    this.clearCopySuccess = this.clearCopySuccess.bind(this);
    this.onClickDelete = this.onClickDelete.bind(this);
    this.onConfirmDelete = this.onConfirmDelete.bind(this);
    this.onCancelDelete = this.onCancelDelete.bind(this);
    this.onPriorityChange = this.onPriorityChange.bind(this);
    this.onPatientGoalChange = this.onPatientGoalChange.bind(this);
    this.formatDateForInput = this.formatDateForInput.bind(this);
    this.getTaskDueDateForInput = this.getTaskDueDateForInput.bind(this);
    this.onDueDateChange = this.onDueDateChange.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.onClickToEditTitle = this.onClickToEditTitle.bind(this);
    this.onClickToEditDescription = this.onClickToEditDescription.bind(this);
    this.focusInput = this.focusInput.bind(this);
    this.getTextHeights = this.getTextHeights.bind(this);
    this.renderPatientGoalOptions = this.renderPatientGoalOptions.bind(this);

    this.editTitleTextArea = null;
    this.editDescriptionTextArea = null;
    this.titleBody = null;
    this.descriptionBody = null;

    this.state = {
      toggleCompletionError: undefined,
      hamburgerMenuVisible: false,
      copySuccessVisible: false,
      deleteConfirmationInProgress: false,
      deleteError: undefined,
      changePriorityError: undefined,
      changeDueDateError: undefined,
      changePatientGoalError: undefined,
      editedTitle: '',
      editingTitle: false,
      editedDescription: '',
      editingDescription: false,
      titleHeight: '100%',
      descriptionHeight: '100%',
    };
  }

  componentWillMount() {
    if (this.props.taskId) {
      this.props.selectTask(this.props.taskId);
    }
  }

  componentDidMount() {
    const { title, description } = this.getTextHeights();
    this.setState(() => ({ titleHeight: title, descriptionHeight: description }));
  }

  componentDidUpdate() {
    const { title, description } = this.getTextHeights();

    if (this.editTitleTextArea && title !== BASE_TEXT_HEIGHT) {
      this.editTitleTextArea.style.height = title;
    }

    if (this.editDescriptionTextArea && description !== BASE_TEXT_HEIGHT) {
      this.editDescriptionTextArea.style.height = description;
    }
  }

  componentWillUnmount() {
    this.props.selectTask(undefined);
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { task } = nextProps;

    if (this.props.taskId !== nextProps.taskId) {
      this.props.selectTask(nextProps.taskId);
    }

    if (task) {
      if (!this.props.task) {
        this.setState(() => ({
          editedTitle: task.title,
          editedDescription: task.description || '',
        }));
      } else if (this.props.task.id !== task.id) {
        this.setState(() => ({
          editedTitle: task.title,
          editedDescription: task.description || '',
        }));
      }
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

  formatDate(date: string) {
    return moment(date, DATETIME_FORMAT).format('MMM D, YYYY');
  }

  formatDateForInput(date: string) {
    return moment(date, DATETIME_FORMAT).format('YYYY-MM-DD');
  }

  getTaskDueDate() {
    const { task } = this.props;

    if (task && task.dueAt) {
      return this.formatDate(task.dueAt);
    } else {
      return 'Unknown Due Date';
    }
  }

  getTaskDueDateForInput() {
    const { task } = this.props;

    if (task && task.dueAt) {
      return this.formatDateForInput(task.dueAt);
    } else {
      return '1970-01-01';
    }
  }

  renderAttachments() {
    const { task } = this.props;

    // TODO: update this once attachments are a thing
    if (task && (task as any).attachments) {
      const attachmentsHtml = ((task as any).attachments || [])
        .map((attachment: any) => <div className={styles.attachment}>{attachment.title}</div>);
      return <div className={styles.attachments}>{attachmentsHtml}</div>;
    } else {
      return <div className={styles.emptyAttachments} />;
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
          }}
        />
      ));

      return (
        <div className={styles.taskFollowers}>
          <div className={styles.smallText}>Followers</div>
          <div className={styles.followersList}>
            {followersHtml}
            <AddTaskFollower
              taskId={task.id}
              followers={task.followers}
              patientId={task.patientId}
            />
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
        <div className={styles.markCompletionIcon} />
      </div>
    );
  }

  renderPatientGoalOptions() {
    const { patientGoals } = this.props;

    if (!patientGoals) {
      return null;
    }

    return patientGoals.map(patientGoal => (
      <option key={patientGoal.id} value={patientGoal.id}>
        {patientGoal.title}
      </option>
    ));
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

  async onPriorityChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { taskId, editTask } = this.props;

    if (taskId) {
      try {
        this.setState(() => ({ changePriorityError: undefined }));
        await editTask({ variables: { taskId, priority: event.target.value } });
      } catch (err) {
        this.setState(() => ({ changePriorityError: err.message }));
      }
    }
  }

  async onPatientGoalChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const { taskId, editTask } = this.props;

    if (taskId) {
      try {
        this.setState(() => ({ changePatientGoalError: undefined }));
        await editTask({ variables: { taskId, patientGoalId: event.target.value } });
      } catch (err) {
        this.setState(() => ({ changePatientGoalError: err.message }));
      }
    }
  }

  async onDueDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    const { taskId, editTask } = this.props;

    if (taskId) {
      try {
        this.setState(() => ({ changeDueDateError: undefined }));
        await editTask({ variables: { taskId, dueAt: event.target.value } });
      } catch (err) {
        this.setState(() => ({ changeDueDateError: err.message }));
      }
    }
  }

  onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.currentTarget.value;
    const name = event.currentTarget.name;

    this.setState(() => ({ [name]: value || '' }));
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const { taskId, editTask } = this.props;
    const { editedTitle, editedDescription } = this.state;
    const enterPressed = event.keyCode === 13;
    const name = event.currentTarget.name;

    if (enterPressed && taskId) {
      event.preventDefault();

      if (name === 'editedTitle') {
        try {
          this.setState(() => ({ editTitleError: undefined }));
          await editTask({ variables: { taskId, title: editedTitle } });
          this.setState(() => ({ editTitleError: undefined, editingTitle: false }));
        } catch (err) {
          this.setState(() => ({ editTitleError: err.message }));
        }
      } else if (name === 'editedDescription') {
        try {
          this.setState(() => ({ editDescriptionError: undefined }));
          await editTask({ variables: { taskId, description: editedDescription } });
          this.setState(() => ({ editDescriptionError: undefined, editingDescription: false }));
        } catch (err) {
          this.setState(() => ({ editDescriptionError: err.message }));
        }
      }
    }
  }

  onBlur(event: React.FocusEvent<HTMLTextAreaElement>) {
    const name = event.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState(() => ({ editingTitle: false }));
    } else if (name === 'editedDescription') {
      this.setState(() => ({ editingDescription: false }));
    }
  }

  onClickToEditTitle() {
    this.setState(() => ({ editingTitle: true }));
    setTimeout(() => (this.focusInput(this.editTitleTextArea), 100));
  }

  onClickToEditDescription() {
    this.setState(() => ({ editingDescription: true }));
    setTimeout(() => (this.focusInput(this.editDescriptionTextArea), 100));
  }

  focusInput(input: HTMLTextAreaElement | HTMLInputElement | null) {
    if (input) {
      input.focus();
    }
  }

  getTextHeights() {
    const heights = {
      title: '100%',
      description: '100%',
    };

    if (this.titleBody) {
      heights.title = `${this.titleBody.clientHeight + 2}px`;
    }

    if (this.descriptionBody) {
      heights.description = `${this.descriptionBody.clientHeight + 2}px`;
    }

    return heights;
  }

  render() {
    const { task, routeBase, taskLoading, taskError } = this.props;
    const {
      hamburgerMenuVisible,
      copySuccessVisible,
      deleteConfirmationInProgress,
      deleteError,
      editedTitle,
      titleHeight,
      editingTitle,
      editTitleError,
      editedDescription,
      descriptionHeight,
      editingDescription,
      editDescriptionError,
    } = this.state;

    const patientName = this.getPatientName();
    const dueDate = this.getTaskDueDate();
    const inputDueDate = this.getTaskDueDateForInput();

    const priorityIconStyles = classNames(styles.priorityIcon, {
      [styles.mediumPriorityIcon]: task && task.priority === 'medium',
      [styles.highPriorityIcon]: task && task.priority === 'high',
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
    const titleTextStyles = classNames(styles.largeText, styles.title, {
      [styles.hidden]: editingTitle,
    });
    const titleEditStyles = classNames(styles.largeTextEditor, {
      [styles.hidden]: !editingTitle,
      [styles.error]: !!editTitleError,
    });
    const descriptionTextStyles = classNames(styles.bodyText, {
      [styles.hidden]: editingDescription,
    });
    const descriptionEditStyles = classNames(styles.descriptionTextEditor, {
      [styles.hidden]: !editingDescription,
      [styles.error]: !!editDescriptionError,
    });

    const closeRoute = routeBase || '/patients';

    if (!task) {
      return (
        <TaskMissing taskLoading={taskLoading} taskError={taskError} reloadTask={this.reloadTask} />
      );
    }
    return (
      <div className={outerContainerStyles}>
        <div className={deleteConfirmationStyles}>
          <div className={styles.deleteConfirmationIcon} />
          <div className={styles.deleteConfirmationText}>
            Are you ure you want to delete this task?
          </div>
          <div className={styles.deleteConfirmationSubtext}>
            Deleting this task will completely remove it from this patient's record.
          </div>
          <div className={styles.deleteConfirmationButtons}>
            <div
              className={classNames(styles.deleteCancelButton, styles.invertedButton)}
              onClick={this.onCancelDelete}
            >
              Cancel
            </div>
            <div className={styles.deleteConfirmButton} onClick={this.onConfirmDelete}>
              Yes, delete
            </div>
          </div>
          <div className={deleteErrorStyles}>
            <div className={classNames(styles.redText, styles.smallText)}>Error deleting task.</div>
            <div className={styles.smallText}>Please try again.</div>
          </div>
        </div>
        <div className={taskContainerStyles}>
          <div className={styles.taskHeader}>
            <div className={styles.infoRow}>
              <div className={styles.patientInfo}>
                <div
                  className={styles.avatar}
                  style={{ backgroundImage: `url('${DEFAULT_AVATAR_URL}')` }}
                />
                <Link to={`/patients/${task.patientId}`} className={styles.name}>
                  {patientName}
                </Link>
              </div>
              <div className={styles.controls}>
                <div className={copySuccessStyles}>Copied to clipboard</div>
                <div className={styles.hamburger} onClick={this.onToggleHamburgerMenu} />
                <TaskHamburgerMenu
                  visible={hamburgerMenuVisible}
                  onClickAddAttachment={() => false}
                  onClickDelete={this.onClickDelete}
                  onCopy={this.onCopyShareLinkClick}
                  taskId={task.id}
                  patientId={task.patientId}
                />
                <Link to={closeRoute} className={styles.close} />
              </div>
            </div>
            <div className={classNames(styles.infoRow, styles.dueDateRow)}>
              <div className={styles.dueDate}>
                <div className={styles.dueDateIcon} />
                <input
                  type='date'
                  className={styles.dueDateInput}
                  data-date={dueDate}
                  value={inputDueDate}
                  onChange={this.onDueDateChange}
                />
              </div>
              {this.renderTaskCompletionToggle()}
            </div>
            <TaskAssignee taskId={task.id} patientId={task.patientId} assignee={task.assignedTo} />
          </div>
          <div className={styles.taskBody}>
            <div
              ref={div => {
                this.titleBody = div;
              }}
              className={titleTextStyles}
              onClick={this.onClickToEditTitle}
            >
              {task.title}
            </div>
            <div className={titleEditStyles}>
              <textarea
                style={{ height: titleHeight }}
                name='editedTitle'
                ref={area => {
                  this.editTitleTextArea = area;
                }}
                value={editedTitle}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                onBlur={this.onBlur}
              />
            </div>
            <div className={styles.okrInfo}>
              <div className={styles.okrRow}>
                <div className={styles.smallText}>Goal:</div>
                <select
                  value={task.patientGoal ? task.patientGoal.id : ''}
                  className={styles.prioritySelect}
                  onChange={this.onPatientGoalChange}
                >
                  <option disabled value=''>
                    None
                  </option>
                  {this.renderPatientGoalOptions()}
                </select>
              </div>
            </div>
            <div
              ref={div => {
                this.descriptionBody = div;
              }}
              onClick={this.onClickToEditDescription}
              className={descriptionTextStyles}
            >
              {task.description ? task.description : 'Enter a description...'}
            </div>
            <div className={descriptionEditStyles}>
              <textarea
                style={{ height: descriptionHeight }}
                name='editedDescription'
                ref={area => {
                  this.editDescriptionTextArea = area;
                }}
                value={editedDescription}
                onChange={this.onChange}
                onKeyDown={this.onKeyDown}
                onBlur={this.onBlur}
              />
            </div>
            {this.renderAttachments()}
            <div className={classNames(styles.infoRow, styles.borderTop, styles.priorityRow)}>
              <div className={styles.priorityInfo}>
                <div className={priorityIconStyles} />
                <select
                  value={task.priority || 'low'}
                  className={styles.prioritySelect}
                  onChange={this.onPriorityChange}
                >
                  <option value='low'>Low priority</option>
                  <option value='medium'>Medium priority</option>
                  <option value='high'>High priority</option>
                </select>
              </div>
              <div className={styles.typeInfo}>
                <div className={styles.typeIcon} />
                <div className={styles.typeText}>Generic</div>
              </div>
            </div>
          </div>
          {this.renderFollowers()}
          <TaskComments taskId={task.id} />
        </div>
      </div>
    );
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
  graphql(taskEditMutation as any, { name: 'editTask' }),
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: data ? data.loading : false,
      taskError: data ? data.error : null,
      task: data ? (data as any).task : null,
      refetchTask: data ? data.refetch : null,
    }),
  }),
)(Task);
