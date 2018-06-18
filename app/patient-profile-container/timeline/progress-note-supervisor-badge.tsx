import React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullProgressNoteFragment } from '../../graphql/types';
import { formatFullName } from '../../shared/helpers/format-helpers';
import Icon from '../../shared/library/icon/icon';
import styles from './css/progress-note-supervisor-badge.css';

interface IProps {
  progressNote: FullProgressNoteFragment;
}

const ProgressNoteSupervisorBadge: React.StatelessComponent<IProps> = (props: IProps) => {
  const { progressNote } = props;
  if (progressNote.needsSupervisorReview && !progressNote.reviewedBySupervisorAt) {
    const supervisorHtml = progressNote.supervisor ? (
      <div className={styles.supervisorName}>
        {formatFullName(progressNote.supervisor.firstName, progressNote.supervisor.lastName)}
      </div>
    ) : null;
    return (
      <FormattedMessage id="progressNote.pendingReview">
        {(message: string) => (
          <div className={styles.supervisorBadge}>
            {message}: {supervisorHtml}
          </div>
        )}
      </FormattedMessage>
    );
  } else if (progressNote.needsSupervisorReview && progressNote.reviewedBySupervisorAt) {
    return (
      <FormattedMessage id="progressNote.reviewed">
        {(message: string) => (
          <div className={styles.supervisorBadge}>
            {message} <Icon className={styles.icon} name={'assignmentTurnedIn'} />
          </div>
        )}
      </FormattedMessage>
    );
  }
  return null;
};

export default ProgressNoteSupervisorBadge;
