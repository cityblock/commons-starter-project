import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/text-input.css';

interface IProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholderMessageId?: string; // optional placeholderMessageId text for empty field
  className?: string; // optional styles to apply over defaults
  name?: string; // optional name field for input
  id?: string; // optional id field for input, likely use with label
}

const TextInput: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, onChange, placeholderMessageId, className, name, id } = props;
  const inputStyles = classNames(styles.input, className);

  if (placeholderMessageId) {
    return (
      <FormattedMessage id={placeholderMessageId}>
        {(message: string) => (
          <input
            type="text"
            value={value}
            placeholder={message}
            onChange={onChange}
            className={inputStyles}
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
      name={name || ''}
      id={id || ''}
    />
  );
};

export default TextInput;
