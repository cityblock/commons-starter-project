import { ApolloError } from 'apollo-client';
import React from 'react';
import { graphql } from 'react-apollo';
import patientScreeningToolSubmissionsFor360 from '../../graphql/queries/get-patient-screening-tool-submission-for-three-sixty.graphql';
import { ShortPatientScreeningToolSubmission360 } from '../../graphql/types';
import EmptyPlaceholder from '../../shared/library/empty-placeholder/empty-placeholder';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import sharedStyles from './css/shared.css';
import { HISTORY_ROUTE } from './patient-three-sixty-domains';
import ScreeningToolHistory from './screening-tool-history';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  submissions: ShortPatientScreeningToolSubmission360[];
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

  return (
    <React.Fragment>
      <UnderlineTabs className={sharedStyles.navBar}>
        <UnderlineTab messageId="threeSixty.summary" selected={false} href={`${routeBase}/360`} />
        <UnderlineTab
          messageId="threeSixty.history"
          selected={true}
          href={`${routeBase}/360/${HISTORY_ROUTE}`}
        />
      </UnderlineTabs>
      <div className={sharedStyles.body}>
        <div className={sharedStyles.container}>
          <div className={sharedStyles.paddedScroll}>{renderedSubmissions}</div>
        </div>
      </div>
    </React.Fragment>
  );
};

export default graphql(patientScreeningToolSubmissionsFor360, {
  options: (props: IProps) => {
    const { patientId, glassBreakId } = props;
    return {
      variables: { patientId, glassBreakId },
      fetchPolicy: 'network-only',
    };
  },
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    submissions: data ? (data as any).patientScreeningToolSubmissionsFor360 : null,
  }),
})(PatientThreeSixtyHistory);
