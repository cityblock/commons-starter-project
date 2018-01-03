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
}

interface IGraphqlProps {
  riskAreaGroupsLoading?: boolean;
  error?: string | null;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
}

type allProps = IGraphqlProps & IProps;

export interface IRiskAreaGroupScore {
  totalScore: number | null;
  forceHighRisk: boolean;
}

export const PatientThreeSixtyDomains: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patientId, routeBase, riskAreaGroups, riskAreaGroupsLoading, history } = props;
  if (riskAreaGroupsLoading) return <Spinner />;

  const body = history ? (
    <PatientThreeSixtyHistory patientId={patientId} />
  ) : (
    <div>
      <DomainSummaries
        patientId={patientId}
        routeBase={routeBase}
        riskAreaGroups={riskAreaGroups}
      />
    </div>
  );

  return (
    <div>
      <UnderlineTabs>
        <UnderlineTab messageId="threeSixty.summary" selected={!history} href={routeBase} />
        <UnderlineTab
          messageId="threeSixty.history"
          selected={history}
          href={`${routeBase}/${HISTORY_ROUTE}`}
        />
      </UnderlineTabs>
      <div className={styles.body}>{body}</div>
    </div>
  );
};

export default graphql<IGraphqlProps, IProps, allProps>(riskAreaGroupsQuery as any, {
  skip: (props: IProps) => props.history,
  props: ({ data }) => ({
    riskAreaGroupsLoading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroups: data ? (data as any).riskAreaGroups : null,
  }),
})(PatientThreeSixtyDomains);
