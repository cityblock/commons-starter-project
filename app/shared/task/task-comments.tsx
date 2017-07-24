import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import * as taskCommentsQuery from '../../graphql/queries/get-task-comments.graphql';
import * as commentCreateMutation from '../../graphql/queries/task-comment-create-mutation.graphql';
import * as commentEditMutation from '../../graphql/queries/task-comment-edit-mutation.graphql';
import {
  FullTaskCommentFragment,
  GetTaskCommentsQuery,
  GetTaskCommentsQueryVariables,
  TaskCommentCreateMutationVariables,
  TaskCommentEditMutationVariables,
} from '../../graphql/types';
import * as styles from './css/task-comments.css';
import TaskComment from './task-comment';

export type ITaskCommentsResponse = GetTaskCommentsQuery['taskComments'];

export interface IProps {
  taskId: string;
  createComment: (
    options: { variables: TaskCommentCreateMutationVariables },
  ) => { data: { taskCommentCreate: FullTaskCommentFragment } };
  taskCommentsLoading: boolean;
  taskCommentsError?: string;
  taskCommentsResponse?: ITaskCommentsResponse;
  refetchTaskComments: () => any;
  updateTaskComments: (
    updateFunction: (
      previousResult: GetTaskCommentsQuery,
      args?: { variables: GetTaskCommentsQueryVariables },
    ) => any) => { taskComments: ITaskCommentsResponse };
  editComment: (
    options: { variables: TaskCommentEditMutationVariables },
  ) => { data: { taskCommentEdit: FullTaskCommentFragment } };
}

export interface IState {
  commentBody: string;
  createCommentError?: string;
  comments: FullTaskCommentFragment[];
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

export class TaskComments extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);

    this.renderComments = this.renderComments.bind(this);
    this.renderComment = this.renderComment.bind(this);
    this.reloadComments = this.reloadComments.bind(this);
    this.onCommentBodyChange = this.onCommentBodyChange.bind(this);
    this.onCommentBodyKeyDown = this.onCommentBodyKeyDown.bind(this);
    this.onCommentEdit = this.onCommentEdit.bind(this);

    this.state = { comments: [], commentBody: '', createCommentError: undefined };
  }

  componentWillReceiveProps(nextProps: IProps) {
    const { taskCommentsResponse } = nextProps;

    if (taskCommentsResponse && taskCommentsResponse.edges) {
      const edges = taskCommentsResponse.edges;
      this.setState(() => ({
        comments: edges.map((edge: any) => edge.node),
      }));
    }
  }

  onCommentBodyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;

    this.setState(() => ({ commentBody: value || '' }));
  }

  async onCommentEdit(editedComment: TaskCommentEditMutationVariables) {
    const { editComment, updateTaskComments } = this.props;
    const { taskCommentId, body } = editedComment;

    try {
      await editComment({ variables: { taskCommentId, body } });
      updateTaskComments((previousResult: GetTaskCommentsQuery) => {
        const edges = previousResult.taskComments && previousResult.taskComments.edges ?
          previousResult.taskComments.edges : [];
        const newNodes = edges.map((edge: { node: FullTaskCommentFragment }) => {
          const { node } = edge;

          if (node.id === taskCommentId) {
            return { ...edge, node: { ...node, body } };
          } else {
            return { ...edge, node };
          }
        });

        return {
          ...previousResult,
          taskComments: {
            ...previousResult.taskComments,
            edges: newNodes,
          },
        };
      });

    } catch (err) {
      throw new Error(err.message);
    }
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
          await createComment({ variables: { taskId, body: commentBody } });
          this.setState(() => ({ commentBody: '' }));

          refetchTaskComments();
        } catch (err) {
          this.setState(() => ({ createCommentError: err.message }));
        }
      }
    }
  }

  renderComment(comment: FullTaskCommentFragment) {
    return (<TaskComment key={comment.id} comment={comment} onEdit={this.onCommentEdit} />);
  }

  reloadComments() {
    const { refetchTaskComments } = this.props;

    if (refetchTaskComments) {
      refetchTaskComments();
    }
  }

  renderComments() {
    const { taskCommentsError, taskCommentsLoading } = this.props;
    const { comments } = this.state;

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
    const { commentBody, createCommentError } = this.state;

    const addCommentErrorStyles = classNames(styles.addCommentError, {
      [styles.hiddenError]: !createCommentError,
    });

    return (
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
    );
  }
}

export default (compose as any)(
  graphql(commentCreateMutation as any, { name: 'createComment' }),
  graphql(commentEditMutation as any, { name: 'editComment' }),
  graphql(taskCommentsQuery as any, {
    options: (props: IProps) => ({
      variables: {
        taskId: props.taskId,
        pageNumber: 0,
        pageSize: 10,
      },
    }),
    props: ({ data }) => ({
      refetchTaskComments: (data ? data.refetch : null),
      taskCommentsLoading: (data ? data.loading : false),
      taskCommentsError: (data ? data.error : null),
      taskCommentsResponse: (data ? (data as any).taskComments : null),
      updateTaskComments: (data ? data.updateQuery : null),
    }),
  }),
)(TaskComments);
