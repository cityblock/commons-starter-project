import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Button from '../button/button';
import * as styles from './css/textarea-with-button.css';

const BASE_TEXT_HEIGHT = '2px';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onSubmit: () => void;
  submitMessageId?: string;
  loadingMessageId?: string;
  placeholderMessageId?: string;
  titleStyles?: boolean; // if true, apply title styles when editing
}

interface IState {
  loading: boolean;
  error: string | null;
  isEditing: boolean;
}

class TextAreaWithButton extends React.Component<IProps, IState> {
  state = { loading: false, error: null, isEditing: false };

  private textarea: HTMLTextAreaElement | null = null;
  private _isMounted: boolean = false;

  componentDidMount(): void {
    this._isMounted = true;
    this.updateTextHeight();
  }

  componentDidUpdate(): void {
    this.updateTextHeight();
  }

  componentWillUnmount(): void {
    this._isMounted = false;
  }

  updateTextHeight(): void {
    // reset height otherwise scrollHeight won't shrink if needed
    if (this.textarea) this.textarea.style.height = BASE_TEXT_HEIGHT;
    const height = this.textarea ? `${this.textarea.scrollHeight + 2}px` : BASE_TEXT_HEIGHT;

    if (this.textarea && height !== BASE_TEXT_HEIGHT) {
      this.textarea.style.height = height;
    }
  }

  handleClick = async (e: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    // prevent from focusing text area
    e.stopPropagation();

    if (!this.state.loading) {
      try {
        this.setState({ loading: true, error: null });

        await this.props.onSubmit();
      } catch (err) {
        this.setState({ error: err.message });
      }

      // avoid calling setState if component unmounted
      if (this._isMounted) {
        this.setState({ loading: false });
      }
    }
  };

  onFocus = (): void => {
    // in case user clicks outside of textarea bounds but within component
    if (this.textarea) {
      this.textarea.focus();
    }
  };

  render(): JSX.Element {
    const {
      value,
      onChange,
      submitMessageId,
      placeholderMessageId,
      loadingMessageId,
      titleStyles,
    } = this.props;
    const { isEditing, error, loading } = this.state;

    const buttonMessageId = loading
      ? loadingMessageId || 'modalButtons.submitting'
      : submitMessageId || 'modalButtons.submit';
    const textMessageId = placeholderMessageId || 'task.addComment';

    const containerStyles = classNames(styles.container, {
      [styles.title]: !!titleStyles,
      [styles.blueBorder]: isEditing,
      [styles.redBorder]: !!error,
    });

    return (
      <FormattedMessage id={textMessageId}>
        {(message: string) => (
          <div className={containerStyles} onClick={this.onFocus}>
            <textarea
              ref={area => (this.textarea = area)}
              value={value}
              onChange={onChange}
              placeholder={message}
              className={styles.textarea}
              onFocus={() => this.setState({ isEditing: true })}
              onBlur={() => this.setState({ isEditing: false })}
            />
            <Button
              messageId={buttonMessageId}
              color="white"
              onClick={this.handleClick}
              className={styles.button}
              disabled={loading}
            />
          </div>
        )}
      </FormattedMessage>
    );
  }
}

export default TextAreaWithButton;
