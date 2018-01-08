import * as React from 'react';
import { FormattedMessage } from 'react-intl';
import { FullProgressNoteFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
import * as styles from './css/progress-note-supervisor-badge.css';

interface IProps {
  progressNote: FullProgressNoteFragment;
}

const ProgressNoteSupervisorBadge: React.StatelessComponent<IProps> = (props: IProps) => {
  const { progressNote } = props;
  if (progressNote.needsSupervisorReview && !progressNote.reviewedBySupervisorAt) {
    return (
      <FormattedMessage id="progressNote.pendingReview">
        {(message: string) => <div className={styles.supervisorBadge}>{message}</div>}
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
