import { ApolloError } from 'apollo-client';
import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreaGroupsQuery from '../../graphql/queries/get-risk-area-groups.graphql';
import { getRiskAreaGroupsQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import * as styles from './css/shared.css';
import DomainSummaries from './domain-summaries';
import PatientThreeSixtyHistory from './patient-three-sixty-history';

export const HISTORY_ROUTE = 'history';

interface IProps {
  patientId: string;
  routeBase: string;
  history: boolean;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
}

type allProps = IGraphqlProps & IProps;

export interface IRiskAreaGroupScore {
  totalScore: number | null;
  forceHighRisk: boolean;
}

export const PatientThreeSixtyDomains: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patientId, routeBase, riskAreaGroups, loading, history, glassBreakId } = props;
  if (loading) return <Spinner />;

  const body = history ? (
    <PatientThreeSixtyHistory patientId={patientId} glassBreakId={glassBreakId} />
  ) : (
    <DomainSummaries
      patientId={patientId}
      routeBase={routeBase}
      riskAreaGroups={riskAreaGroups}
      glassBreakId={glassBreakId}
    />
  );

  return (
    <React.Fragment>
      <UnderlineTabs className={styles.navBar}>
        <UnderlineTab messageId="threeSixty.summary" selected={!history} href={routeBase} />
        <UnderlineTab
          messageId="threeSixty.history"
          selected={history}
          href={`${routeBase}/${HISTORY_ROUTE}`}
        />
      </UnderlineTabs>
      <div className={styles.bodyFlex}>{body}</div>
    </React.Fragment>
  );
};

export default graphql<any, any, any, any>(riskAreaGroupsQuery as any, {
  skip: (props: IProps) => props.history,
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroups: data ? (data as any).riskAreaGroups : null,
  }),
})(PatientThreeSixtyDomains) as React.ComponentClass<IProps>;
