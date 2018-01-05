import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientScreeningToolSubmissionsFor360Query from '../../graphql/queries/get-patient-screening-tool-submission-for-three-sixty.graphql';
import { ShortPatientScreeningToolSubmission360Fragment } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/patient-three-sixty-history.css';
import ScreeningToolHistory from './screening-tool-history';

interface IProps {
  patientId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  submissions: ShortPatientScreeningToolSubmission360Fragment[];
}

type allProps = IGraphqlProps & IProps;

export const PatientThreeSixtyHistory: React.StatelessComponent<allProps> = (props: allProps) => {
  const { loading, error, submissions, patientId } = props;
  if (loading || error) return <Spinner />;

  const routeBase = `/patients/${patientId}`;
  const renderedSubmissions = submissions.length ? (
    submissions.map((submission, i) => {
      let prevSubmission = null;
      // find the previous submission for that screening tool if it exists
      for (let j = i + 1; j < submissions.length; j++) {
        if (submissions[j].screeningTool.id === submission.screeningTool.id) {
          prevSubmission = submissions[j];
          break;
        }
      }

      return (
        <ScreeningToolHistory
          key={submission.id}
          submission={submission}
          prevSubmission={prevSubmission}
          routeBase={routeBase}
        />
      );
    })
  ) : (
    <EmptyPlaceholder headerMessageId="threeSixty.historyEmpty" />
  );

  return <div className={styles.container}>{renderedSubmissions}</div>;
};

export default graphql<IGraphqlProps, IProps, allProps>(
  patientScreeningToolSubmissionsFor360Query as any,
  {
    options: (props: IProps) => {
      const { patientId } = props;
      return { variables: { patientId } };
    },
    props: ({ data }) => ({
      loading: data ? data.loading : false,
      error: data ? data.error : null,
      submissions: data ? (data as any).patientScreeningToolSubmissionsFor360 : null,
    }),
  },
)(PatientThreeSixtyHistory);
