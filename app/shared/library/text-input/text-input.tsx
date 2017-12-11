import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/text-input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderMessageId?: string | null; // optional placeholderMessageId text for empty field
  className?: string | null; // optional styles to apply over defaults
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
  onBlur?: () => void;
  onFocus?: () => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TextInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    value,
    onChange,
    placeholderMessageId,
    onBlur,
    onFocus,
    onKeyDown,
    className,
    name,
    id,
  } = props;
  const inputStyles = classNames(styles.input, className);

  if (placeholderMessageId) {
    return (
      <FormattedMessage id={placeholderMessageId}>
        {(message: string) => (
          <input
            type="text"
            value={value}
            placeholder={message}
            className={inputStyles}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onChange={onChange}
            name={name || ''}
            id={id || ''}
          />
        )}
      </FormattedMessage>
    );
  }

  return (
    <input
      type="text"
      value={value}
      onChange={onChange}
      className={inputStyles}
      onFocus={onFocus}
      onBlur={onBlur}
      name={name || ''}
      id={id || ''}
    />
  );
};

export default TextInput;
