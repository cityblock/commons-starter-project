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
  textStyles?: string; // optional text styles to be applied on top of defaults
  editStyles?: string; // optional edit styles to be applied on top of defaults
  placeholderMessageId?: string; // optional translate message id for when field is empty
}

interface IState {
  editMode: boolean;
  editedText: string;
  error: string;
}

class EditableMultilineText extends React.Component<IProps, IState> {
  private textBody: HTMLParagraphElement | null;
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

  componentWillUpdate(): void {
    const height = this.getTextHeight();

    if (this.editText && height !== BASE_TEXT_HEIGHT) {
      this.editText.style.height = height;
    }
  }

  getTextHeight(): string {
    return this.textBody ? `${this.textBody.clientHeight + 2}px` : '100%';
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
    const { text, textStyles, editStyles, descriptionField, placeholderMessageId } = this.props;
    const { editMode, editedText, error } = this.state;

    const fullTextStyles = classNames(
      styles.text,
      {
        [styles.hide]: editMode,
        [styles.description]: descriptionField,
      },
      textStyles,
    );

    const fullEditStyles = classNames(
      styles.edit,
      {
        [styles.hide]: !editMode,
        [styles.error]: !!error,
        [styles.descriptionEdit]: descriptionField,
      },
      editStyles,
    );

    // if empty field and placeholder message id given, translate
    // corresponding placeholder message
    const displayText =
      text || !placeholderMessageId ? (
        <p ref={p => (this.textBody = p)} className={fullTextStyles} onClick={this.onClick}>
          {text}
        </p>
      ) : (
        <FormattedMessage id={placeholderMessageId}>
          {(message: string) => (
            <p
              ref={p => (this.textBody = p)}
              className={classNames(fullTextStyles, styles.placeholder)}
              onClick={this.onClick}
            >
              {message}
            </p>
          )}
        </FormattedMessage>
      );

    return (
      <div className={styles.container}>
        {displayText}
        <textarea
          ref={area => (this.editText = area)}
          value={editedText}
          className={fullEditStyles}
          onChange={this.onChange}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
        />
      </div>
    );
  }
}

export default EditableMultilineText;
