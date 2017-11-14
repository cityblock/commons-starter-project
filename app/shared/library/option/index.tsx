import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  value: string;
  label?: string;
  messageId?: string;
  disabled?: boolean;
}

const Option: React.StatelessComponent<IProps> = ({ value, label, messageId, disabled }) => {
  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <option disabled={disabled} value={value}>
            {message}
          </option>
        )}
      </FormattedMessage>
    );
  }

  return (
    <option value={value} disabled={disabled}>
      {label}
    </option>
  );
};

export default Option;
