import * as React from 'react';
import { graphql } from 'react-apollo';
import * as patientScreeningToolSubmissionsFor360Query from '../../graphql/queries/get-patient-screening-tool-submission-for-three-sixty.graphql';
import { ShortPatientScreeningToolSubmission360Fragment } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
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
  const renderedSubmissions = submissions.map(submission => {
    return (
      <ScreeningToolHistory key={submission.id} submission={submission} routeBase={routeBase} />
    );
  });

  return <div>{renderedSubmissions}</div>;
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
