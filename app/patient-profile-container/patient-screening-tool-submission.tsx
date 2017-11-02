import * as React from 'react';
import { FormattedDate } from 'react-intl';
import { FullPatientScreeningToolSubmissionFragment } from '../graphql/types';
import * as styles from './css/screening-tools.css';

interface IProps {
  submission?: FullPatientScreeningToolSubmissionFragment;
  loading?: boolean;
  error?: string;
}

export const PatientScreeningToolSubmission: React.StatelessComponent<IProps> = props => {
  const { submission, loading, error } = props;

  if (!loading && !error && !!submission) {
    const { score, screeningToolScoreRange, user, createdAt } = submission;
    const conductedByName = `${user.firstName} ${user.lastName}`;
    const conductedAt = (
      <FormattedDate value={createdAt} year="numeric" month="short" day="numeric" />
    );

    let scoreDescription: string = 'Unknown Score Meaning';

    if (screeningToolScoreRange) {
      scoreDescription = screeningToolScoreRange.description;
    }

    return (
      <div className={styles.screeningToolSubmissionSection}>
        <div className={styles.screeningToolSubmission}>
          <div className={styles.screeningToolSubmissionTitleRow}>
            <div className={styles.screeningToolSubmissionTitle}>
              <div className={styles.screeningToolSubmissionTitleLabel}>Tool results:</div>
              <div className={styles.screeningToolSubmissionTitleScore}>
                <div>{scoreDescription}</div>
                <div className={styles.screeningToolSubmissionTitleScoreDivider}>-</div>
                <div>{score}</div>
                <div className={styles.screeningToolSubmissionTitleInfoButton} />
              </div>
            </div>
            <div className={styles.screeningToolSubmissionMeta}>
              <div className={styles.screeningToolSubmissionMetaGroup}>
                <div className={styles.screeningToolSubmissionMetaLabel}>Conducted by:</div>
                <div className={styles.screeningToolSubmissionMetaData}>{conductedByName}</div>
              </div>
              <div className={styles.screeningToolSubmissionMetaGroup}>
                <div className={styles.screeningToolSubmissionMetaLabel}>Date conducted:</div>
                <div className={styles.screeningToolSubmissionMetaData}>{conductedAt}</div>
              </div>
            </div>
          </div>
          <div className={styles.screeningToolSubmissionSummaryRow}>TBD</div>
        </div>
      </div>
    );
  } else {
    return null;
  }
};
