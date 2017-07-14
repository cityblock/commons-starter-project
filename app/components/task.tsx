import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { selectTask } from '../actions/task-action';
import { DATETIME_FORMAT } from '../config';
import * as styles from '../css/components/task.css';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import { FullTaskFragment } from '../graphql/types';
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
}

export interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

class Task extends React.Component<IProps, {}> {
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

  getPatientName(task?: FullTaskFragment) {
    if (task) {
      const { patient } = task;

      return `${patient ? patient.firstName : 'Unknown'} ${patient ? patient.lastName : 'Unknown'}`;
    } else {
      return 'No Patient';
    }
  }

  getAssigneeInfo(task?: FullTaskFragment): IAssigneeInfo {
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

  getTaskDueDate(task?: FullTaskFragment) {
    if (task && task.dueAt) {
      return moment(task.dueAt, DATETIME_FORMAT).format('MMM D, YYYY');
    } else {
      return 'Unknown Due Date';
    }
  }

  renderAttachments(task?: FullTaskFragment) {
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

  renderFollowers(task?: FullTaskFragment) {
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

  render() {
    const { task } = this.props;
    const patientName = this.getPatientName(task);
    const assigneeInfo = this.getAssigneeInfo(task);
    const dueDate = this.getTaskDueDate(task);

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
              <div className={styles.markCompletion}>
                <div className={styles.markCompletionText}>Mark complete</div>
                <div className={styles.markCompletionIcon}></div>
              </div>
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
            {this.renderAttachments(task)}
            <div className={classNames(styles.infoRow, styles.borderTop)}>
              <div className={styles.priorityInfo}>
                <div className={styles.priorityIcon}></div>
                <div className={styles.priorityText}>High priority</div>
              </div>
              <div className={styles.typeInfo}>
                <div className={styles.typeIcon}></div>
                <div className={styles.typeText}>Prescription</div>
              </div>
            </div>
          </div>
          {this.renderFollowers(task)}
          <div className={styles.taskComments}>
            <div className={styles.addComment}>
              <textarea placeholder={'Add a comment...'} />
              <div className={styles.uploadAttachment}></div>
            </div>
            <div className={styles.smallText}>Activity and comments (2)</div>
            <div className={styles.commentsList}>
              <div className={styles.comment}>
                <div className={styles.commentHeader}>
                  <div className={styles.author}>
                    <div
                      className={styles.avatar}
                      style={{ backgroundImage: `url('${DEFAULT_AVATAR_URL}')` }}>
                    </div>
                    <div className={styles.name}>Lucielle Mendoza</div>
                    <div className={styles.smallText}>Nurse case manager</div>
                  </div>
                  <div className={styles.commentDate}>
                    <div className={styles.smallText}>Jun 18, 2017</div>
                  </div>
                </div>
                <div className={styles.commentBody}>
                  {
                    'Donnec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit ' +
                    'amet, consectetur adipiscing elit. Vivamus sagittis Iacus vel augue Iaoreet ' +
                    'rutrum faucibus dolor auctor.'
                  }
                </div>
              </div>
              <div className={styles.comment}>
                <div className={styles.commentHeader}>
                  <div className={styles.author}>
                    <div
                      className={styles.avatar}
                      style={{ backgroundImage: `url('${DEFAULT_AVATAR_URL}')` }}>
                    </div>
                    <div className={styles.name}>George Perkins</div>
                    <div className={styles.smallText}>Community care worker</div>
                  </div>
                  <div className={styles.commentDate}>
                    <div className={styles.smallText}>June 16, 2017</div>
                  </div>
                </div>
                <div className={styles.commentBody}>
                  {
                    'Donnec ullamcorper nulla non metus auctor fringilla. Lorem ipsum dolor sit ' +
                    'amet, consectetur adipiscing elit. Vivamus sagittis Iacus vel augue Iaoreet ' +
                    'rutrum faucibus dolor auctor.'
                  }
                </div>
              </div>
            </div>
          </div>
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

export default compose(
  connect(mapStateToProps, mapDispatchToProps),
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
