import classNames from 'classnames';
import { format } from 'date-fns';
import React from 'react';
import { FullSmsMessage } from '../../graphql/types';
import Text from '../../shared/library/text/text';
import styles from './css/sms-message.css';

export const TIME_FORMAT = 'h:mm a';

interface IProps {
  smsMessage: FullSmsMessage;
}

const SmsMessage: React.StatelessComponent<IProps> = ({ smsMessage }) => {
  const formattedTime = format(smsMessage.createdAt, TIME_FORMAT);

  const containerStyles = classNames(styles.container, {
    [styles.alignRight]: smsMessage.direction === 'fromUser',
  });

  const contentStyles = classNames(styles.content, {
    [styles.alignRight]: smsMessage.direction === 'fromUser',
  });

  const messageColor = smsMessage.direction === 'toUser' ? 'blue' : 'black';
  const messageStyles = classNames(styles.message, {
    [styles.toUser]: smsMessage.direction === 'toUser',
    [styles.fromUser]: smsMessage.direction === 'fromUser',
  });

  return (
    <div className={containerStyles}>
      <div className={contentStyles}>
        <Text text={smsMessage.body} color={messageColor} size="large" className={messageStyles} />
        <Text text={formattedTime} color="lightGray" size="medium" className={styles.timestamp} />
      </div>
    </div>
  );
};

export default SmsMessage;
