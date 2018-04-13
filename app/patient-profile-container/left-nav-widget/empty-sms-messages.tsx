import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/empty-sms-messages.css';

const EmptySmsMessages: React.StatelessComponent = () => {
  return (
    <div className={styles.container}>
      <Icon name="inbox" color="gray" className={styles.icon} />
      <SmallText messageId="messages.empty" size="large" color="lightGray" />
    </div>
  );
};

export default EmptySmsMessages;
