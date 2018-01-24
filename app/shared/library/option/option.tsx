import * as React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  value: string;
  label?: string;
  messageId?: string;
  disabled?: boolean;
  indent?: boolean; // hack to indent when not possible to use optgroup, prefer optgroup
}

const Option: React.StatelessComponent<IProps> = (props: IProps) => {
  const { value, label, messageId, disabled, indent } = props;

  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => (
          <option disabled={disabled} value={value}>
            {indent ? `\u00A0\u00A0\u00A0\u00A0${message}` : `${message}`}
          </option>
        )}
      </FormattedMessage>
    );
  }

  return (
    <option value={value} disabled={disabled}>
      {indent ? `\u00A0\u00A0\u00A0\u00A0${label || value}` : `${label || value}`}
    </option>
  );
};

export default Option;
