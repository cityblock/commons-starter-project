import * as React from 'react';
import { FormattedTime } from 'react-intl';
import { FullProgressNoteFragment } from '../graphql/types';
import { DEFAULT_PATIENT_AVATAR_URL } from '../patient-profile-container/patient-left-nav-info';
import * as styles from './css/progress-note-small-row.css';

interface IProps {
  progressNote: FullProgressNoteFragment;
  onClick: (patientId: string) => void;
}

export const ProgressNoteSmallRow: React.StatelessComponent<IProps> = props => {
  const { progressNote, onClick } = props;
  const name = progressNote.patient
    ? `${progressNote.patient.firstName} ${progressNote.patient.lastName}`
    : null;
  const formattedTime = progressNote.createdAt ? (
    <FormattedTime value={progressNote.createdAt} />
  ) : null;
  return (
    <div
      key={progressNote.id}
      className={styles.progressNote}
      onClick={() => onClick(progressNote.patientId)}
    >
      <div
        className={styles.patientPhoto}
        style={{ backgroundImage: `url('${DEFAULT_PATIENT_AVATAR_URL}')` }}
      />
      <div className={styles.progressNoteRight}>
        <div className={styles.patientName}>{name}</div>
        <div className={styles.bottomSection}>
          <div className={styles.progressNoteType}>
            {progressNote.progressNoteTemplate
              ? progressNote.progressNoteTemplate.title
              : 'unknown'}
          </div>
          <div className={styles.time}>{formattedTime}</div>
        </div>
      </div>
    </div>
  );
};
