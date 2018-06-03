import { ApolloError } from 'apollo-client';
import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
import * as currentUserQuery from '../../graphql/queries/get-current-user.graphql';
import {
  taskCommentEditMutationVariables,
  FullTaskCommentFragment,
  FullUserFragment,
} from '../../graphql/types';
import Avatar from '../library/avatar/avatar';
import * as styles from './css/task-comments.css';

interface IProps {
  onEdit: (editedComment: taskCommentEditMutationVariables) => any;
  comment: FullTaskCommentFragment;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  currentUser?: FullUserFragment;
}

interface IState {
  editedCommentBody?: string;
  editing: boolean;
  textHeight: string;
  editError: string | null;
}

type allProps = IProps & IGraphqlProps;

const BASE_TEXT_HEIGHT = '2px';

export class TaskComment extends React.Component<allProps, IState> {
  static getDerivedStateFromProps(newProps: allProps, prevState: IState) {
    const { comment } = newProps;
    if (!prevState.editedCommentBody && comment) {
      return { editedCommentBody: comment.body };
    }
    return null;
  }

  editInput: HTMLTextAreaElement | null = null;
  textBody: HTMLDivElement | null = null;
  state = {
    editedCommentBody: undefined,
    editing: false,
    textHeight: '100%',
    editError: null,
  };

  componentDidMount() {
    const textHeight = this.getTextHeight();
    this.setState({ textHeight });
  }

  componentDidUpdate() {
    const textHeight = this.getTextHeight();

    if (this.editInput && textHeight !== BASE_TEXT_HEIGHT) {
      this.editInput.style.height = textHeight;
    }
  }

  getTextHeight() {
    if (this.textBody) {
      return `${this.textBody.clientHeight + 2}px`;
    } else {
      return '100%';
    }
  }

  focusEditInput = () => {
    if (this.editInput) {
      this.editInput.focus();
    }
  };

  onBlur = () => {
    this.setState({ editing: false });
  };

  onClick = () => {
    if (this.isEditable()) {
      this.setState({ editing: true });

      setTimeout(this.focusEditInput, 100);
    }
  };

  onChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = event.target.value;

    this.setState({ editedCommentBody: value || '' });
  };

  onKeyDown = async (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const enterPressed = event.keyCode === 13;
    const shiftPressed = event.shiftKey;
    const { editedCommentBody } = this.state;

    if (enterPressed && !shiftPressed && editedCommentBody) {
      event.preventDefault();

      const { comment, onEdit } = this.props;

      try {
        this.setState({ editError: null });

        await onEdit({ taskCommentId: comment.id, body: editedCommentBody });

        this.setState({ editError: null, editing: false });
      } catch (err) {
        this.setState({ editError: err.message });
      }
    }
  };

  isEditable = () => {
    const { comment, currentUser } = this.props;

    return currentUser && comment.user.id === currentUser.id;
  };

  getCommentDate(comment: FullTaskCommentFragment) {
    if (comment.createdAt) {
      return <FormattedDate value={comment.createdAt} year="numeric" month="short" day="numeric" />;
    } else {
      return 'Unknown Date';
    }
  }

  render() {
    const { comment } = this.props;
    const { editError } = this.state;
    const { user } = comment;

    const { editedCommentBody, editing, textHeight } = this.state;

    const formattedCommentBody = comment.body.split('\n').map((item: string, sKey: number) => (
      <span key={sKey}>
        {item}
        <br />
      </span>
    ));

    const commentStyles = classNames(styles.comment, {
      [styles.editable]: this.isEditable(),
      [styles.editing]: editing,
    });
    const errorStyles = classNames(styles.error, {
      [styles.hidden]: !editError,
    });

    return (
      <div className={commentStyles} onClick={this.onClick}>
        <div className={styles.commentHeader}>
          <div className={styles.commentAuthor}>
            <Avatar src={user.googleProfileImageUrl} size="small" />
            <div className={styles.name}>{`${user.firstName} ${user.lastName}`}</div>
            <div className={styles.smallText}>{user.userRole}</div>
          </div>
          <div className={styles.commentDate}>
            <div className={errorStyles}>
              <div className={styles.errorText}>Error saving.</div>
              <div className={styles.smallText}>Please try again</div>
            </div>
            <div className={styles.smallText}>{this.getCommentDate(comment)}</div>
          </div>
        </div>
        <div
          ref={div => {
            this.textBody = div;
          }}
          className={styles.commentBody}
        >
          {formattedCommentBody}
        </div>
        <div className={styles.commentEditArea}>
          <textarea
            style={{ height: textHeight }}
            ref={input => {
              this.editInput = input;
            }}
            value={editedCommentBody}
            onChange={this.onChange}
            onKeyDown={this.onKeyDown}
            onBlur={this.onBlur}
          />
        </div>
      </div>
    );
  }
}

export default graphql<any, any, any, any>(currentUserQuery as any, {
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    currentUser: data ? (data as any).currentUser : null,
  }),
})(TaskComment as any) as React.ComponentClass<IProps>;
