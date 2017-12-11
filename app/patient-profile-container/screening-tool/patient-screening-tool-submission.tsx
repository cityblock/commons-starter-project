import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
/* tsline:enable:max-line-length */
import { FullPatientScreeningToolSubmissionFragment } from '../../graphql/types';
import * as styles from './css/screening-tools.css';

interface IProps {
  screeningToolId: string;
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error: string | null;
  submission?: FullPatientScreeningToolSubmissionFragment;
}

type allProps = IGraphqlProps & IProps;

const PatientScreeningToolSubmission: React.StatelessComponent<allProps> = props => {
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

export default graphql<IGraphqlProps, IProps, allProps>(
  patientScreeningToolSubmissionQuery as any,
  {
    skip: (props: IProps) => !props.screeningToolId,
    options: (props: IProps) => ({
      variables: {
        screeningToolId: props.screeningToolId,
        patientId: props.patientId,
        scored: true,
      },
    }),
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      submission: data
        ? (data as any).patientScreeningToolSubmissionForPatientAndScreeningTool
        : null,
    }),
  },
)(PatientScreeningToolSubmission);
