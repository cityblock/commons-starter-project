import * as classNames from 'classnames';
import * as React from 'react';
import { taskEditMutation, taskEditMutationVariables } from '../../graphql/types';
import * as styles from './css/task-info.css';

const FOCUS_TIMEOUT = 100; // ms
const BASE_TEXT_HEIGHT = '2px';

interface IProps {
  title: string;
  description: string;
  taskId: string;
  editTask: (options: { variables: taskEditMutationVariables }) => { data: taskEditMutation };
}

interface IState {
  editTitleMode: boolean;
  editDescriptionMode: boolean;
  editedTitle: string;
  editTitleError: string;
  editedDescription: string;
  editDescriptionError: string;
}

class TaskTitle extends React.Component<IProps, IState> {
  private editTitle: HTMLTextAreaElement | null;
  private editDescription: HTMLTextAreaElement | null;
  private titleBody: HTMLHeadingElement | null;
  private descriptionBody: HTMLParagraphElement | null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      editTitleMode: false,
      editDescriptionMode: false,
      editedTitle: props.title || '',
      editTitleError: '',
      editedDescription: props.description || '',
      editDescriptionError: '',
    };

    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    const { title, description } = this.getTextHeights();
    this.setState(() => ({ titleHeight: title, descriptionHeight: description }));
  }

  componentWillReceiveProps(nextProps: IProps): void {
    // Ensure we set initial edited title or description to originals
    // not defined on initialization
    if (!this.state.editedTitle || nextProps.title !== this.props.title) {
      this.setState({ editedTitle: nextProps.title });
    }

    if (!this.state.editedDescription || nextProps.description !== this.props.description) {
      this.setState({ editedDescription: nextProps.description });
    }
  }

  componentDidUpdate(): void {
    const { title, description } = this.getTextHeights();

    if (this.editTitle && title !== BASE_TEXT_HEIGHT) {
      this.editTitle.style.height = title;
    }

    if (this.editDescription && description !== BASE_TEXT_HEIGHT) {
      this.editDescription.style.height = description;
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

  onEditTitle = (): void => {
    this.setState({ editTitleMode: true });
    setTimeout(() => this.focusInput(this.editTitle), FOCUS_TIMEOUT);
  };

  onEditDescription = (): void => {
    this.setState({ editDescriptionMode: true });
    setTimeout(() => this.focusInput(this.editDescription), FOCUS_TIMEOUT);
  };

  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const value = e.currentTarget.value;
    const name = e.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState({ editedTitle: value });
    } else if (name === 'editedDescription') {
      this.setState({ editedDescription: value });
    }
  };

  async onKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    const { taskId, editTask } = this.props;
    const { editedTitle, editedDescription } = this.state;
    const enterPressed = e.keyCode === 13;
    const name = e.currentTarget.name;

    if (enterPressed && taskId) {
      // prevents from creating new line
      e.preventDefault();

      if (name === 'editedTitle') {
        try {
          await editTask({ variables: { taskId, title: editedTitle } });
          this.setState({ editTitleError: '', editTitleMode: false });
        } catch (err) {
          this.setState({ editTitleError: err.message });
        }
      } else if (name === 'editedDescription') {
        try {
          await editTask({ variables: { taskId, description: editedDescription } });
          this.setState({ editDescriptionError: '', editDescriptionMode: false });
        } catch (err) {
          this.setState({ editDescriptionError: err.message });
        }
      }
    }
  }

  focusInput = (input: HTMLTextAreaElement | HTMLInputElement | null): void => {
    if (input) input.focus();
  };

  onBlur = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
    const name = e.currentTarget.name;

    if (name === 'editedTitle') {
      this.setState({ editTitleMode: false, editedTitle: this.props.title });
    } else if (name === 'editedDescription') {
      this.setState({ editDescriptionMode: false, editedDescription: this.props.description });
    }
  };

  render(): JSX.Element {
    const { title, description } = this.props;
    const {
      editTitleMode,
      editedTitle,
      editTitleError,
      editDescriptionMode,
      editedDescription,
      editDescriptionError,
    } = this.state;

    const titleStyles = classNames(styles.title, {
      [styles.hide]: editTitleMode,
    });

    const descriptionStyles = classNames(styles.description, {
      [styles.hide]: editDescriptionMode,
      [styles.noJump]: editTitleMode,
    });

    const editTitleStyles = classNames(styles.editTitle, {
      [styles.error]: !!editTitleError,
      [styles.hide]: !editTitleMode,
    });

    const editDescriptionStyles = classNames(styles.editDescription, {
      [styles.error]: !!editDescriptionError,
      [styles.hide]: !editDescriptionMode,
    });

    return (
      <div>
        <h2 ref={h2 => (this.titleBody = h2)} className={titleStyles} onClick={this.onEditTitle}>
          {title}
        </h2>
        <textarea
          ref={area => (this.editTitle = area)}
          name="editedTitle"
          value={editedTitle}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          className={editTitleStyles}
        />
        <p
          ref={p => (this.descriptionBody = p)}
          className={descriptionStyles}
          onClick={this.onEditDescription}
        >
          {description}
        </p>
        <textarea
          ref={area => (this.editDescription = area)}
          name="editedDescription"
          value={editedDescription}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          className={editDescriptionStyles}
        />
      </div>
    );
  }
}

export default TaskTitle;
