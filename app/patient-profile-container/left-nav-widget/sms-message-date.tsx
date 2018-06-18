import { format } from 'date-fns';
import React from 'react';
import Text from '../../shared/library/text/text';
import styles from './css/sms-message-date.css';

const DATE_FORMAT = 'ddd, MMM D, YYYY';

interface IProps {
  date: string;
}

const SmsMessageDate: React.StatelessComponent<IProps> = ({ date }) => {
  const formattedDate = format(date, DATE_FORMAT);

  return (
    <div className={styles.container}>
      <div className={styles.divider} />
      <div className={styles.date}>
        <Text text={formattedDate} size="small" color="gray" />
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export default SmsMessageDate;
