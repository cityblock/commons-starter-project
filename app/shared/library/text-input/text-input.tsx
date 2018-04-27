import * as classNames from 'classnames';
import * as React from 'react';
import { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import SmallText from '../small-text/small-text';
import * as styles from './css/text-input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderMessageId?: string | null; // optional placeholderMessageId text for empty field
  className?: string | null; // optional styles to apply over defaults
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  smallInput?: boolean;
  inputType?: 'datetime-local' | 'time'; // default is text
  required?: boolean;
  pattern?: string;
  errorMessageId?: string;
  hasError?: boolean;
  inputRef?: (ref: any) => void;
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
    smallInput,
    inputType,
    required,
    pattern,
    errorMessageId,
    hasError,
    inputRef,
  } = props;
  const inputStyles = classNames(styles.input, className, {
    [styles.small]: !!smallInput,
    [styles.error]: hasError,
  });
  const type = inputType || 'text';
  const req = required || false;

  const errorMessage = hasError ? <SmallText messageId={errorMessageId} color="red" /> : null;

  if (placeholderMessageId) {
    return (
      <FormattedMessage id={placeholderMessageId}>
        {(message: string) => (
          <input
            type={type}
            value={value}
            placeholder={message}
            className={inputStyles}
            onBlur={onBlur}
            onFocus={onFocus}
            onKeyDown={onKeyDown}
            onChange={onChange}
            name={name || ''}
            required={req}
            id={id || ''}
            ref={inputRef}
            pattern={pattern}
          />
        )}
      </FormattedMessage>
    );
  }

  return (
    <Fragment>
      <input
        type={type}
        value={value}
        className={inputStyles}
        onFocus={onFocus}
        onBlur={onBlur}
        onKeyDown={onKeyDown}
        onChange={onChange}
        name={name || ''}
        required={req}
        ref={inputRef}
        id={id || ''}
      />
      {errorMessage}
    </Fragment>
  );
};

export default TextInput;
