import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/textarea.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholderMessageId?: string; // optional placeholderMessageId text for empty field
  className?: string; // optional styles to apply over defaults
  id?: string; // optional id field for input, likely use with label
  onBlur?: () => void;
  onFocus?: () => void;
}

const TextArea: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, className, placeholderMessageId, onBlur, onFocus, id } = props;
  const textareaStyles = classNames(styles.textarea, className);

  if (placeholderMessageId) {
    return (
      <FormattedMessage id={placeholderMessageId}>
        {(message: string) => (
          <textarea
            value={value}
            onChange={onChange}
            placeholder={message}
            className={textareaStyles}
            onBlur={onBlur}
            onFocus={onFocus}
            id={id || ''}
          />
        )}
      </FormattedMessage>
    );
  }

  return (
    <textarea
      value={value}
      onChange={onChange}
      className={textareaStyles}
      onBlur={onBlur}
      onFocus={onFocus}
      id={id || ''}
    />
  );
};

export default TextArea;
