import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/text-divider.css';

interface IProps {
  messageId?: string; // strongly prefer using messageId over label
  label?: string;
}

const TextDivider: React.StatelessComponent<IProps> = ({ messageId, label }) => {
  const text = messageId ? (
    <FormattedMessage id={messageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : (
    <p>{label}</p>
  );

  return (
    <div className={styles.container}>
      {text}
      <div className={styles.divider} />
    </div>
  );
};

export default TextDivider;
