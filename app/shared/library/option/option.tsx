import classNames from 'classnames';
import React from 'react';
import { FormattedMessage } from 'react-intl';
import styles from './css/option.css';

interface IProps {
  value: string | number;
  label?: string;
  messageId?: string;
  disabled?: boolean;
  indent?: boolean; // hack to indent when not possible to use optgroup, prefer optgroup
}

const Option: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, label, messageId, disabled, indent } = props;
  const className = classNames(styles.option, {
    [styles.disabled]: !!disabled,
  });

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <option className={className} disabled={disabled} value={value}>
            {indent ? `\u00A0\u00A0\u00A0\u00A0${message}` : `${message}`}
          </option>
        )}
      </FormattedMessage>
    );
  }

  return (
    <option className={className} value={value} disabled={disabled}>
      {indent ? `\u00A0\u00A0\u00A0\u00A0${label || value}` : `${label || value}`}
    </option>
  );
};

export default Option;
