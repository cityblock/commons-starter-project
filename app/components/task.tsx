import * as classNames from 'classnames';
import * as moment from 'moment';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { connect, Dispatch } from 'react-redux';
import { selectTask } from '../actions/task-action';
import { DATETIME_FORMAT } from '../config';
import * as styles from '../css/components/task.css';
import * as taskCommentsQuery from '../graphql/queries/get-task-comments.graphql';
import * as taskQuery from '../graphql/queries/get-task.graphql';
import * as commentCreateMutation from '../graphql/queries/task-comment-create-mutation.graphql';
import * as taskCompleteMutation from '../graphql/queries/task-complete-mutation.graphql';
import * as taskUncompleteMutation from '../graphql/queries/task-uncomplete-mutation.graphql';
import {
  FullTaskCommentFragment,
  FullTaskFragment,
  TaskCommentCreateMutationVariables,
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
  createComment: (
    options: { variables: TaskCommentCreateMutationVariables },
  ) => { data: { taskCommentCreate: FullTaskCommentFragment } };
  taskCommentsLoading: boolean;
  taskCommentsError?: string;
  taskCommentsResponse?: {
    edges: Array<{
      node: FullTaskCommentFragment;
    }>;
    pageInfo: {
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    };
  };
  refetchTaskComments: () => any;
}

export interface IState {
  commentBody: string;
  createCommentError?: string;
}

export interface IAssigneeInfo {
  avatar: string;
  name: string;
  role: string;
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

class Task extends React.Component<IProps, IState> {
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
    this.renderComments = this.renderComments.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.getCommentDate = this.getCommentDate.bind(this);
    this.reloadComments = this.reloadComments.bind(this);
    this.onCommentBodyChange = this.onCommentBodyChange.bind(this);
    this.onCommentBodyKeyDown = this.onCommentBodyKeyDown.bind(this);

    this.state = { commentBody: '', createCommentError: undefined };
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

  onCommentBodyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;

    this.setState(() => ({ commentBody: value || '' }));
  }

  async onCommentBodyKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const enterPressed = event.keyCode === 13;
    const shiftPressed = event.shiftKey;

    if (enterPressed && !shiftPressed) {
      event.preventDefault();

      const { createComment, taskId, refetchTaskComments } = this.props;
      const { commentBody } = this.state;

      if (taskId && commentBody) {
        try {
          this.setState(() => ({ createCommentError: undefined }));
          await createComment({ variables: { taskId, body: commentBody }});
          this.setState(() => ({ commentBody: '' }));

          refetchTaskComments();
        } catch (err) {
          this.setState(() => ({ createCommentError: err.message }));
        }
      }
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

  getCommentDate(comment: FullTaskCommentFragment) {
    if (comment.createdAt) {
      return this.formatDate(comment.createdAt);
    } else {
      return 'Unknown Date';
    }
  }

  renderComment(comment: FullTaskCommentFragment) {
    const { user } = comment;
    const formattedCommentBody = comment.body.split('\n').map((item: string, key: number) => (
      <p key={key}>{item}</p>
    ));

    return (
      <div key={comment.id} className={styles.comment}>
        <div className={styles.commentHeader}>
          <div className={styles.author}>
            <div
              className={styles.avatar}
              style={{
                backgroundImage: `url('${user.googleProfileImageUrl || DEFAULT_AVATAR_URL}')`,
              }}>
            </div>
            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={styles.smallText}>{user.userRole}</div>
          </div>
          <div className={styles.commentDate}>
            <div className={styles.smallText}>{this.getCommentDate(comment)}</div>
          </div>
        </div>
        <div className={styles.commentBody}>{formattedCommentBody}</div>
      </div>
    );
  }

  reloadComments() {
    const { refetchTaskComments } = this.props;

    if (refetchTaskComments) {
      refetchTaskComments();
    }
  }

  renderComments() {
    const { taskCommentsResponse, taskCommentsError, taskCommentsLoading } = this.props;

    const comments = taskCommentsResponse ?
      taskCommentsResponse.edges.map((edge: any) => edge.node).reverse() : [];

    if (taskCommentsLoading) {
      return (
        <div>
          <div className={styles.smallText}>Loading comments...</div>
          <div className={styles.commentsList}>
            {comments.map(this.renderComment)}
          </div>
        </div>
      );
    } else if (taskCommentsError) {
      return (
        <div className={styles.commentsError}>
          <div className={classNames(styles.smallText, styles.redText)}>
            Error loading comments.
          </div>
          <div className={styles.reload} onClick={this.reloadComments}>
            <div className={styles.smallText}>
              Click to try again.
            </div>
            <div className={styles.reloadIcon}></div>
          </div>
        </div>
      );
    } else {
      return (
        <div>
          <div className={styles.smallText}>Activity and comments ({comments.length})</div>
          <div className={styles.commentsList}>
            {comments.map(this.renderComment)}
          </div>
        </div>
      );
    }
  }

  render() {
    const { task } = this.props;
    const { commentBody, createCommentError } = this.state;

    const patientName = this.getPatientName();
    const assigneeInfo = this.getAssigneeInfo();
    const dueDate = this.getTaskDueDate();
    const addCommentErrorStyles = classNames(styles.addCommentError, {
      [styles.hiddenError]: !createCommentError,
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
                <div className={styles.priorityIcon}></div>
                <div className={styles.priorityText}>High priority</div>
              </div>
              <div className={styles.typeInfo}>
                <div className={styles.typeIcon}></div>
                <div className={styles.typeText}>Prescription</div>
              </div>
            </div>
          </div>
          {this.renderFollowers()}
          <div className={styles.taskComments}>
            <div className={styles.addComment}>
              <textarea
                placeholder={'Add a comment...'}
                value={commentBody}
                onChange={this.onCommentBodyChange}
                onKeyDown={this.onCommentBodyKeyDown}
              />
              <div className={styles.uploadAttachment}></div>
              <div className={addCommentErrorStyles}>
                <div className={classNames(styles.smallText, styles.redText)}>
                  Error adding comment.
                </div>
                <div className={styles.smallText}>Please try again.</div>
              </div>
            </div>
            {this.renderComments()}
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

export default (compose as any)(
  connect(mapStateToProps, mapDispatchToProps),
  graphql(taskCompleteMutation as any, { name: 'completeTask' }),
  graphql(taskUncompleteMutation as any, { name: 'uncompleteTask' }),
  graphql(commentCreateMutation as any, { name: 'createComment' }),
  graphql(taskQuery as any, {
    skip: (props: IProps) => !props.taskId,
    options: (props: IProps) => ({ variables: { taskId: props.taskId } }),
    props: ({ data }) => ({
      taskLoading: (data ? data.loading : false),
      taskError: (data ? data.error : null),
      task: (data ? (data as any).task : null),
    }),
  }),
  graphql(taskCommentsQuery as any, {
    options: (props: IProps) => ({ variables: {
      taskId: props.taskId,
      pageNumber: 0,
      pageSize: 10,
    } }),
    props: ({ data }) => ({
      refetchTaskComments: (data ? data.refetch : null),
      taskCommentsLoading: (data ? data.loading : false),
      taskCommentsError: (data ? data.error : null),
      taskCommentsResponse: (data ? (data as any).taskComments : null),
    }),
  }),
)(Task);
