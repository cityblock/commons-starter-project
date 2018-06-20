import React from 'react';
import { FormattedDate } from 'react-intl';
import { ShortUser } from '../../graphql/types';
import styles from './css/progress-note-row-questions.css';

interface IProps {
  supervisor: ShortUser | null;
  supervisorNotes: string;
  reviewedBySupervisorAt: string;
}

const ProgressNoteSupervisorNotes: React.StatelessComponent<IProps> = (props: IProps) => {
  const { supervisor, supervisorNotes, reviewedBySupervisorAt } = props;
  const supervisorName = supervisor ? `${supervisor.firstName} ${supervisor.lastName}` : null;
  return (
    <div className={styles.container}>
      <div className={styles.answers}>
        <div>
          <div className={styles.heading}>Supervisor</div>
          <div className={styles.body}>{supervisorName}</div>
        </div>
        <div>
          <div className={styles.heading}>Date reviewed and signed</div>
          <div className={styles.body}>
            <FormattedDate
              value={reviewedBySupervisorAt}
              year="numeric"
              month="short"
              day="numeric"
            />
          </div>
        </div>
      </div>
      <div className={styles.heading}>Supervisor notes</div>
      <div className={styles.body}>{supervisorNotes}</div>
    </div>
  );
};

export default ProgressNoteSupervisorNotes;
