import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/shared.css';

interface IProps {
  messageId: string;
  htmlFor: string;
}

export const FieldLabel: React.StatelessComponent<IProps> = (props: IProps) => {
  const { messageId, htmlFor } = props;

  return (
    <FormattedMessage id={messageId}>
      {(message: string) => (
        <label htmlFor={htmlFor} className={styles.label}>
          {message}
        </label>
      )}
    </FormattedMessage>
  );
};
