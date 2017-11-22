import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import * as styles from './css/empty-placeholder.css';

interface IProps {
  headerMessageId?: string; // prefer using message ids to plain text
  detailMessageId?: string; // prefer using message ids to plain text
  headerText?: string;
  detailText?: string;
}

const EmptyPlaceholder: React.StatelessComponent<IProps> = (props: IProps) => {
  const { headerMessageId, detailMessageId, headerText, detailText } = props;

  const header = headerMessageId ? (
    <FormattedMessage id={headerMessageId}>
      {(message: string) => <h3>{message}</h3>}
    </FormattedMessage>
  ) : (
    <h3>{headerText}</h3>
  );

  const detail = detailMessageId ? (
    <FormattedMessage id={detailMessageId}>
      {(message: string) => <p>{message}</p>}
    </FormattedMessage>
  ) : (
    <p>{detailText}</p>
  );

  return (
    <div className={styles.container}>
      <div className={styles.icon} />
      {header}
      {detail}
    </div>
  );
};

export default EmptyPlaceholder;
