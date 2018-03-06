import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/editable-multiline-text.css';

const FOCUS_TIMEOUT = 100; // ms
const BASE_TEXT_HEIGHT = '2px';

interface IProps {
  text: string;
  onEnterPress: (newText: string) => void;
  descriptionField?: boolean; // optional flag that field is description (default is title styles)
  editStyles?: string; // optional edit styles to be applied on top of defaults
  placeholderMessageId?: string; // optional translate message id for when field is empty
  disabled?: boolean; // if true, does not allow editing on click
}

interface IState {
  editMode: boolean;
  editedText: string;
  error: string;
}

export class EditableMultilineText extends React.Component<IProps, IState> {
  private editText: HTMLTextAreaElement | null;

  constructor(props: IProps) {
    super(props);

    this.state = {
      editMode: false,
      editedText: props.text,
      error: '',
    };
  }

  componentWillReceiveProps(nextProps: IProps): void {
    // ensure that state reflects latest text, especially if multiple instances of component
    if (nextProps.text !== this.props.text) {
      this.setState({ editedText: nextProps.text });
    }
  }

  componentDidMount(): void {
    this.updateTextHeight();
  }

  componentDidUpdate(): void {
    this.updateTextHeight();
  }

  updateTextHeight(): void {
    // reset height otherwise scrollHeight won't shrink if needed
    if (this.editText) this.editText.style.height = BASE_TEXT_HEIGHT;
    const height = this.editText ? `${this.editText.scrollHeight + 2}px` : BASE_TEXT_HEIGHT;

    if (this.editText && height !== BASE_TEXT_HEIGHT) {
      this.editText.style.height = height;
    }
  }

  onClick = (): void => {
    this.setState({ editMode: true });
    setTimeout(() => this.focusInput(this.editText), FOCUS_TIMEOUT);
  };

  onChange = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    const editedText = e.currentTarget.value;
    this.setState({ editedText });
  };

  onKeyDown = async (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // if enter was pressed
    if (e.keyCode === 13) {
      e.preventDefault();

      try {
        await this.props.onEnterPress(this.state.editedText);
        this.setState({ editMode: false, error: '' });
      } catch (err) {
        this.setState({ error: err.message });
      }
    }
  };

  focusInput = (input: HTMLTextAreaElement | null): void => {
    if (input) input.focus();
  };

  onBlur = (e: React.FocusEvent<HTMLTextAreaElement>): void => {
    this.setState({ editMode: false, editedText: this.props.text });
  };

  render(): JSX.Element {
    const { editStyles, descriptionField, placeholderMessageId, disabled } = this.props;
    const { editMode, editedText, error } = this.state;

    const fullEditStyles = classNames(
      styles.edit,
      {
        [styles.error]: !!error,
        [styles.descriptionEdit]: descriptionField,
        [styles.disabled]: !editMode,
      },
      editStyles,
    );
    const handleClick = !disabled ? this.onClick : undefined;

    return (
      <FormattedMessage id={placeholderMessageId || 'editableText.default'}>
        {(message: string) => (
          <div className={styles.container} onClick={handleClick}>
            <textarea
              ref={area => (this.editText = area)}
              value={editedText}
              className={fullEditStyles}
              onChange={this.onChange}
              onBlur={this.onBlur}
              onKeyDown={this.onKeyDown}
              disabled={!editMode}
              spellCheck={editMode}
              placeholder={message}
            />
          </div>
        )}
      </FormattedMessage>
    );
  }
}

export default EditableMultilineText;
