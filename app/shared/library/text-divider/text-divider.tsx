import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/text-divider.css';

interface IProps {
  messageId?: string; // strongly prefer using messageId over label
  label?: string;
  gray?: boolean; // optional flag to make text gray
  hasPadding?: boolean; // optional flag to add medium gutter margins
}

const TextDivider: React.StatelessComponent<IProps> = ({ messageId, label, gray, hasPadding }) => {
  const text = messageId ? (
    <FormattedMessage id={messageId}>{(message: string) => <p>{message}</p>}</FormattedMessage>
  ) : (
    <p>{label}</p>
  );

  const containerStyles = classNames(styles.container, {
    [styles.gray]: !!gray,
    [styles.padding]: !!hasPadding,
  });

  return (
    <div className={containerStyles}>
      {text}
      <div className={styles.divider} />
    </div>
  );
};

export default TextDivider;
