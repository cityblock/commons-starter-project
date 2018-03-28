import { format } from 'date-fns';
import * as React from 'react';
import SmallText from '../../../shared/library/small-text/small-text';
import * as styles from './css/timeline-card.css';

interface IProps {
  source: string;
  sourceDetail: string;
  title: string;
  date: string;
  notes: string | null;
}

const TimelineCard: React.StatelessComponent<IProps> = (props: IProps) => {
  const { source, sourceDetail, title, date, notes } = props;
  const formattedDate = format(date, 'MMM D, YYYY');
  const formattedTime = format(date, 'h:mm a');

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.sourceInfo}>
          <SmallText
            text={source}
            size="medium"
            color="black"
            isBold
            className={styles.rightMargin}
          />
          <div className={styles.pill}>
            <SmallText text={sourceDetail} size="small" color="darkGray" />
          </div>
        </div>
        <div className={styles.dateInfo}>
          <SmallText
            text={formattedTime}
            size="medium"
            color="black"
            className={styles.rightMargin}
          />
          <SmallText text={formattedDate} size="medium" color="black" />
        </div>
      </div>
      <h1>{title}</h1>
      {!!notes && (
        <SmallText text={notes} size="large" color="black" className={styles.topMargin} />
      )}
    </div>
  );
};

export default TimelineCard;
