import * as React from 'react';
import { graphql } from 'react-apollo';
import { FormattedDate } from 'react-intl';
/* tslint:disable:max-line-length */
import * as patientScreeningToolSubmissionQuery from '../../graphql/queries/get-patient-screening-tool-submission-for-patient-and-screening-tool.graphql';
/* tsline:enable:max-line-length */
import { FullPatientScreeningToolSubmissionFragment } from '../../graphql/types';
import Icon from '../../shared/library/icon/icon';
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
      <div className={styles.section}>
        <div className={styles.container}>
          <div className={styles.titleRow}>
            <div className={styles.title}>
              <div className={styles.titleLabel}>Tool results:</div>
              <div className={styles.titleScore}>
                <div>{scoreDescription}</div>
                <div className={styles.titleScoreDivider}>-</div>
                <div>{score}</div>
                <Icon name="highlightOff" />
              </div>
            </div>
            <div className={styles.meta}>
              <div className={styles.metaGroup}>
                <div className={styles.metaLabel}>Conducted by:</div>
                <div className={styles.metaData}>{conductedByName}</div>
              </div>
              <div className={styles.metaGroup}>
                <div className={styles.metaLabel}>Date conducted:</div>
                <div className={styles.metaData}>{conductedAt}</div>
              </div>
            </div>
          </div>
          <div className={styles.summaryRow}>TBD</div>
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
