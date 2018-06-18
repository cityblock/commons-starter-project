import React from 'react';
import { FormattedMessage } from 'react-intl';

interface IProps {
  messageId?: string; // translated message id
  label?: string; // text label, prefer using translated messages
  children?: any;
}

const OptGroup: React.StatelessComponent<IProps> = ({ messageId, label, children }) => {
  if (messageId) {
    return (
      <FormattedMessage id={messageId}>
        {(message: string) => <optgroup label={message}>{children}</optgroup>}
      </FormattedMessage>
    );
  }

  return <optgroup label={label}>{children}</optgroup>;
};

export default OptGroup;
