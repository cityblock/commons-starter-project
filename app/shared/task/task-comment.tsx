import * as classNames from 'classnames';
import * as React from 'react';
import { compose, graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
import * as currentUserQuery from '../../graphql/queries/get-current-user.graphql';
import {
  taskCommentEditMutationVariables,
  FullTaskCommentFragment,
  FullUserFragment,
} from '../../graphql/types';
import * as styles from './css/task-comments.css';

export interface IProps {
  comment: FullTaskCommentFragment;
  currentUser?: FullUserFragment;
  onEdit: (editedComment: taskCommentEditMutationVariables) => any;
}

export interface IState {
  editedCommentBody: string;
  editing: boolean;
  textHeight: string;
  editError?: string;
}

export const DEFAULT_AVATAR_URL = 'http://bit.ly/2u9bJDA';

const BASE_TEXT_HEIGHT = '2px';

export class TaskComment extends React.Component<IProps, IState> {
  editInput: HTMLTextAreaElement | null;
  textBody: HTMLDivElement | null;

  constructor(props: IProps) {
    super(props);

    const { comment } = props;

    this.onClick = this.onClick.bind(this);
    this.isEditable = this.isEditable.bind(this);
    this.getCommentDate = this.getCommentDate.bind(this);
    this.focusEditInput = this.focusEditInput.bind(this);
    this.onChange = this.onChange.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
    this.onBlur = this.onBlur.bind(this);
    this.getTextHeight = this.getTextHeight.bind(this);

    this.editInput = null;
    this.textBody = null;

    this.state = {
      editedCommentBody: comment.body,
      editing: false,
      textHeight: '100%',
      editError: undefined,
    };
  }

  componentDidMount() {
    const textHeight = this.getTextHeight();
    this.setState(() => ({ textHeight }));
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

  focusEditInput() {
    if (this.editInput) {
      this.editInput.focus();
    }
  }

  onBlur() {
    this.setState(() => ({ editing: false }));
  }

  onClick() {
    if (this.isEditable()) {
      this.setState(() => ({ editing: true }));

      setTimeout(this.focusEditInput, 100);
    }
  }

  onChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    const value = event.target.value;

    this.setState(() => ({ editedCommentBody: value || '' }));
  }

  async onKeyDown(event: React.KeyboardEvent<HTMLTextAreaElement>) {
    const enterPressed = event.keyCode === 13;
    const shiftPressed = event.shiftKey;

    if (enterPressed && !shiftPressed) {
      event.preventDefault();

      const { comment, onEdit } = this.props;
      const { editedCommentBody } = this.state;

      try {
        this.setState(() => ({ editError: undefined }));

        await onEdit({ taskCommentId: comment.id, body: editedCommentBody});

        this.setState(() => ({ editError: undefined, editing: false }));
      } catch (err) {
        this.setState(() => ({ editError: err.message }));
      }
    }
  }

  isEditable() {
    const { comment, currentUser } = this.props;

    return currentUser && comment.user.id === currentUser.id;
  }

  getCommentDate(comment: FullTaskCommentFragment) {
    if (comment.createdAt) {
      return <FormattedDate value={comment.createdAt} year='numeric' month='short' day='numeric' />;
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
      <span key={sKey}>{item}<br /></span>
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
            <div className={errorStyles}>
              <div className={styles.errorText}>Error saving.</div>
              <div className={styles.smallText}>Please try again</div>
            </div>
            <div className={styles.smallText}>{this.getCommentDate(comment)}</div>
          </div>
        </div>
        <div
          ref={div => { this.textBody = div; }}
          className={styles.commentBody}>
          {formattedCommentBody}
        </div>
        <div className={styles.commentEditArea}>
          <textarea
            style={{ height: textHeight }}
            ref={input => { this.editInput = input; }}
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

export default (compose as any)(
  graphql(currentUserQuery as any, {
    props: ({ data }) => ({
      currentUser: (data ? (data as any).currentUser : null),
    }),
  }),
)(TaskComment);
