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
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  smallInput?: boolean;
  inputType?: 'datetime-local'; // default is text
  required?: boolean;
  pattern?: string;
  ref?: (ref: any) => void;
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
    ref,
  } = props;
  const inputStyles = classNames(styles.input, className, {
    [styles.small]: !!smallInput,
  });
  const type = inputType || 'text';
  const req = required || false;

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
            ref={ref}
            pattern={pattern}
          />
        )}
      </FormattedMessage>
    );
  }

  return (
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
      ref={ref}
      id={id || ''}
    />
  );
};

export default TextInput;
