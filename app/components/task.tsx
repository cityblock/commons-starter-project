import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
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

export interface IProps {
  task?: FullTaskFragment;
  taskId?: string;
  taskLoading?: boolean;
  taskError?: string;
  selectTask: (taskId?: string) => any;
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
}

export interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

class Task extends React.Component<IProps, {}> {
  constructor(props: IProps) {
    super(props);

    this.getPatientName = this.getPatientName.bind(this);
    this.getAssigneeInfo = this.getAssigneeInfo.bind(this);
    this.formatDate = this.formatDate.bind(this);
    this.getTaskDueDate = this.getTaskDueDate.bind(this);
    this.renderAttachments = this.renderAttachments.bind(this);
    this.renderFollowers = this.renderFollowers.bind(this);
    this.renderTaskCompletionToggle = this.renderTaskCompletionToggle.bind(this);
    this.onClickToggleCompletion = this.onClickToggleCompletion.bind(this);
    this.getTaskPriorityText = this.getTaskPriorityText.bind(this);
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

  onClickToggleCompletion() {
    const { task, completeTask, uncompleteTask } = this.props;

    if (task && !!task.completedAt) {
      uncompleteTask({ variables: { taskId: task.id } });
    } else if (task) {
      completeTask({ variables: { taskId: task.id } });
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
    let displayText: string = '';

    if (task) {
      displayText = !!task.completedAt ? 'Complete' : 'Mark complete';
    } else {
      displayText = 'Mark complete';
    }

    const completionStyles = classNames(styles.markCompletion, {
      [styles.completedIcon]: task && !!task.completedAt,
    });

    return (
      <div className={completionStyles} onClick={this.onClickToggleCompletion}>
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

  render() {
    const { task } = this.props;

    const patientName = this.getPatientName();
    const assigneeInfo = this.getAssigneeInfo();
    const dueDate = this.getTaskDueDate();

    const priorityIconStyles = classNames(styles.priorityIcon, {
      [styles.mediumPriorityIcon]: (task && task.priority === 'medium'),
      [styles.highPriorityIcon]: (task && task.priority === 'high'),
    });

    if (task) {
      return (
        <div className={styles.container}>
          <div className={styles.taskHeader}>
            <div className={styles.infoRow}>
              <div className={styles.patientInfo}>
                <div
                  className={styles.avatar}
                  style={{ backgroundImage: `url('${DEFAULT_AVATAR_URL}')`}}>
                </div>
                <div className={styles.name}>{patientName}</div>
              </div>
              <div className={styles.controls}>
                <div className={styles.hamburger}></div>
                <div className={styles.close}></div>
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
      );
    } else {
      return (
        <div className={styles.container}>
          loading...
        </div>
      );
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
    }),
  }),
)(Task);
