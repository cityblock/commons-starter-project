import * as classNames from 'classnames';
import { format } from 'date-fns';
import * as React from 'react';
import { FullProgressNoteFragment } from '../../../graphql/types';
import Button from '../../../shared/library/button/button';
import Text from '../../../shared/library/text/text';
import ProgressNoteSupervisorBadge from '../progress-note-supervisor-badge';
import * as styles from './css/timeline-card.css';

interface IProps {
  source: string;
  sourceDetail: string;
  title: string;
  date: string;
  notes: string | null;
  progressNote?: FullProgressNoteFragment;
  onClose?: (() => void) | null; // if passed, displays close button
  children?: any;
}

const TimelineCard: React.StatelessComponent<IProps> = (props: IProps) => {
  const { source, sourceDetail, title, date, notes, progressNote, onClose, children } = props;
  const formattedDate = format(date, 'MMM D, YYYY');
  const formattedTime = format(date, 'h:mm a');

  const sourceInfo = progressNote ? (
    <Text text={sourceDetail} size="medium" />
  ) : (
    <div className={styles.pill}>
      <Text text={sourceDetail} size="small" color="darkGray" />
    </div>
  );

  const containerStyles = classNames(styles.container, {
    [styles.dashed]: progressNote && progressNote.needsSupervisorReview,
  });

  return (
    <div className={containerStyles}>
      <div className={styles.header}>
        <div className={styles.sourceInfo}>
          <Text text={source} size="medium" color="black" isBold className={styles.rightMargin} />
          {sourceInfo}
        </div>
        <div className={styles.dateInfo}>
          <Text text={formattedTime} size="medium" color="black" className={styles.rightMargin} />
          <Text text={formattedDate} size="medium" color="black" />
        </div>
      </div>
      <div className={styles.title}>
        <div className={styles.titleText}>
          <h1>{title}</h1>
          {!!progressNote && <ProgressNoteSupervisorBadge progressNote={progressNote} />}
        </div>
        {!!onClose && <Button color="white" messageId="progressNote.close" onClick={onClose} />}
      </div>
      {!!notes && <Text text={notes} size="large" color="black" className={styles.topMargin} />}
      {children}
    </div>
  );
};

export default TimelineCard;
