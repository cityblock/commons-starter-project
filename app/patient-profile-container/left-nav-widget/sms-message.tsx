import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { FullSmsMessageFragment } from '../../graphql/types';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/sms-message.css';

export const TIME_FORMAT = 'h:mm a';

interface IProps {
  smsMessage: FullSmsMessageFragment;
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
        <SmallText
          text={smsMessage.body}
          color={messageColor}
          size="large"
          className={messageStyles}
        />
        <SmallText
          text={formattedTime}
          color="lightGray"
          size="medium"
          className={styles.timestamp}
        />
      </div>
    </div>
  );
};

export default SmsMessage;
