import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import Icon from '../icon/icon';
import { IconName } from '../icon/icon-types';
import * as styles from './css/empty-placeholder.css';

export const DEFAULT_ICON = 'inbox'; // empty box icon

interface IProps {
  headerMessageId?: string; // prefer using message ids to plain text
  detailMessageId?: string; // prefer using message ids to plain text
  headerText?: string;
  detailText?: string;
  icon?: IconName;
}

const EmptyPlaceholder: React.StatelessComponent<IProps> = (props: IProps) => {
  const { headerMessageId, detailMessageId, headerText, detailText, icon } = props;

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
      <Icon name={icon || DEFAULT_ICON} className={styles.icon} />
      {header}
      {detail}
    </div>
  );
};

export default EmptyPlaceholder;
