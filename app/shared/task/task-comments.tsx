import classNames from 'classnames';
import React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedMessage } from 'react-intl';
import taskCommentsGraphql from '../../graphql/queries/get-task-comments.graphql';
import commentCreateGraphql from '../../graphql/queries/task-comment-create-mutation.graphql';
import commentEditGraphql from '../../graphql/queries/task-comment-edit-mutation.graphql';
import {
  getTaskComments,
  getTaskCommentsVariables,
  taskCommentCreate,
  taskCommentCreateVariables,
  taskCommentEdit,
  taskCommentEditVariables,
  FullTaskComment,
} from '../../graphql/types';
import TextAreaWithButton from '../../shared/library/textarea-with-button/textarea-with-button';
import styles from './css/task-comments.css';
import TaskComment from './task-comment';

export type ITaskCommentsResponse = getTaskComments['taskComments'];

export interface IProps {
  taskId: string;
}

interface IGraphqlProps {
  createComment: (
    options: { variables: taskCommentCreateVariables },
  ) => { data: taskCommentCreate };
  taskCommentsLoading: boolean;
  taskCommentsError: string | null;
  taskCommentsResponse?: ITaskCommentsResponse;
  refetchTaskComments: () => any;
  updateTaskComments: (
    updateFunction: (
      previousResult: getTaskComments,
      args?: { variables: getTaskCommentsVariables },
    ) => any,
  ) => { taskComments: ITaskCommentsResponse };
  editComment: (options: { variables: taskCommentEditVariables }) => { data: taskCommentEdit };
}

interface IState {
  commentBody: string;
  comments: FullTaskComment[];
}

type allProps = IProps & IGraphqlProps;

export class TaskComments extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(nextProps: allProps, prevState: IState) {
    const { taskCommentsResponse } = nextProps;

    if (taskCommentsResponse && taskCommentsResponse.edges) {
      const edges = taskCommentsResponse.edges;
      return {
        comments: edges.map((edge: any) => edge.node),
        commentBody: prevState.commentBody,
      };
    }
    return null;
  }

  state = { comments: [], commentBody: '' };

  onCommentBodyChange = (event: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = event.target.value;

    this.setState({ commentBody: value || '' });
  };

  onCommentEdit = async (editedComment: taskCommentEditVariables): Promise<void> => {
    const { editComment, updateTaskComments } = this.props;
    const { taskCommentId, body } = editedComment;

    try {
      await editComment({ variables: { taskCommentId, body } });
      updateTaskComments((previousResult: getTaskComments) => {
        const edges =
          previousResult.taskComments && previousResult.taskComments.edges
            ? previousResult.taskComments.edges
            : [];
        const newNodes = edges.map(edge => {
          if (edge && edge.node) {
            const { node } = edge;
            if (node) {
              if (node.id === taskCommentId) {
                return { ...edge, node: { ...node, body } };
              } else {
                return { ...edge, node };
              }
            }
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
  };

  onCommentCreate = async (): Promise<void> => {
    const { createComment, taskId, refetchTaskComments } = this.props;
    const { commentBody } = this.state;

    if (taskId && commentBody) {
      await createComment({ variables: { taskId, body: commentBody } });
      this.setState({ commentBody: '' });

      refetchTaskComments();
    }
  };

  renderComment = (comment: FullTaskComment): JSX.Element => {
    return <TaskComment key={comment.id} comment={comment} onEdit={this.onCommentEdit} />;
  };

  reloadComments = (): void => {
    const { refetchTaskComments } = this.props;

    if (refetchTaskComments) {
      refetchTaskComments();
    }
  };

  renderComments() {
    const { taskCommentsError, taskCommentsLoading } = this.props;
    const { comments } = this.state;

    if (taskCommentsLoading) {
      return (
        <div className={styles.comments}>
          <div className={styles.smallText}>Loading comments...</div>
          <div className={styles.commentsList}>{comments.map(this.renderComment)}</div>
        </div>
      );
    } else if (taskCommentsError) {
      return (
        <div className={styles.commentsError}>
          <div className={classNames(styles.smallText, styles.redText)}>
            Error loading comments.
          </div>
          <div className={styles.reload} onClick={this.reloadComments}>
            <div className={styles.smallText}>Click to try again.</div>
            <div className={styles.reloadIcon} />
          </div>
        </div>
      );
    } else {
      return (
        <div className={styles.comments}>
          <FormattedMessage id="taskComment.activity">
            {(message: string) => (
              <div className={classNames(styles.smallText, styles.divider)}>
                {`${message} (${comments.length})`}
              </div>
            )}
          </FormattedMessage>
          <div className={styles.commentsList}>{comments.map(this.renderComment)}</div>
        </div>
      );
    }
  }

  render() {
    const { commentBody } = this.state;
    return (
      <div className={styles.taskComments}>
        <TextAreaWithButton
          value={commentBody}
          onChange={this.onCommentBodyChange}
          onSubmit={this.onCommentCreate}
        />
        {this.renderComments()}
      </div>
    );
  }
}

export default compose(
  graphql(commentCreateGraphql, {
    name: 'createComment',
  }),
  graphql(commentEditGraphql, {
    name: 'editComment',
  }),
  graphql(taskCommentsGraphql, {
    options: (props: IProps) => ({
      variables: {
        taskId: props.taskId,
        pageNumber: 0,
        pageSize: 10,
      },
    }),
    props: ({ data }) => ({
      refetchTaskComments: data ? data.refetch : null,
      taskCommentsLoading: data ? data.loading : false,
      taskCommentsError: data ? data.error : null,
      taskCommentsResponse: data ? (data as any).taskComments : null,
      updateTaskComments: data ? data.updateQuery : null,
    }),
  }),
)(TaskComments) as React.ComponentClass<IProps>;
