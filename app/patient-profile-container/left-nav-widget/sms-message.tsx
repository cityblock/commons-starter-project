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

  return (
    <div className={styles.container}>
      <div className={styles.flex}>
        <SmallText text={smsMessage.body} color="blue" size="large" className={styles.message} />
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
