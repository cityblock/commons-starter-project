import * as classNames from 'classnames';
import * as React from 'react';
import { FormattedTime } from 'react-intl';
import { FullProgressNoteFragment } from '../graphql/types';
import { DEFAULT_PATIENT_AVATAR_URL } from '../patient-profile-container/patient-left-nav-info';
import * as styles from './css/progress-note-small-row.css';

interface IProps {
  progressNote: FullProgressNoteFragment;
  currentUserId: string;
  onClick: (patientId: string) => void;
}

export const ProgressNoteSmallRow: React.StatelessComponent<IProps> = props => {
  const { progressNote, onClick, currentUserId } = props;
  const name = progressNote.patient
    ? `${progressNote.patient.firstName} ${progressNote.patient.lastName}`
    : null;
  const formattedTime = progressNote.createdAt ? (
    <FormattedTime value={progressNote.createdAt} />
  ) : null;
  let title = progressNote.progressNoteTemplate ? progressNote.progressNoteTemplate.title : null;
  let titleStyles = styles.title;
  if (
    progressNote.needsSupervisorReview &&
    progressNote.supervisor &&
    progressNote.supervisor.id === currentUserId
  ) {
    title = 'Supervisor review';
    titleStyles = classNames(styles.title, styles.highlight);
  }
  return (
    <div
      key={progressNote.id}
      className={styles.progressNote}
      onClick={() => onClick(progressNote.id)}
    >
      <div
        className={styles.patientPhoto}
        style={{ backgroundImage: `url('${DEFAULT_PATIENT_AVATAR_URL}')` }}
      />
      <div className={styles.progressNoteRight}>
        <div className={styles.patientName}>{name}</div>
        <div className={styles.bottomSection}>
          <div className={titleStyles}>{title}</div>
          <div className={styles.time}>{formattedTime}</div>
        </div>
      </div>
    </div>
  );
};
