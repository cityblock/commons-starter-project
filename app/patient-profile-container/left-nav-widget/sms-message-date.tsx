import { format } from 'date-fns';
import * as React from 'react';
import SmallText from '../../shared/library/small-text/small-text';
import * as styles from './css/sms-message-date.css';

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
        <SmallText text={formattedDate} size="small" color="gray" />
      </div>
      <div className={styles.divider} />
    </div>
  );
};

export default SmsMessageDate;
