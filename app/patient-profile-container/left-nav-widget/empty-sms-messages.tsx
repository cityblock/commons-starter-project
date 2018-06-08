import * as React from 'react';
import Icon from '../../shared/library/icon/icon';
import Text from '../../shared/library/text/text';
import * as styles from './css/empty-sms-messages.css';

const EmptySmsMessages: React.StatelessComponent = () => {
  return (
    <div className={styles.container}>
      <Icon name="inbox" color="gray" className={styles.icon} />
      <Text messageId="messages.empty" size="large" color="lightGray" />
    </div>
  );
};

export default EmptySmsMessages;
