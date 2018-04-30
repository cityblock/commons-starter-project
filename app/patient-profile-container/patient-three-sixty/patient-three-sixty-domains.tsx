import * as React from 'react';
import { graphql } from 'react-apollo';
import * as riskAreaGroupsForPatientQuery from '../../graphql/queries/get-risk-area-groups-for-patient.graphql';
import { getRiskAreaGroupsForPatientQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import * as styles from './css/shared.css';
import { DomainSummaries } from './domain-summaries';
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
  riskAreaGroups: getRiskAreaGroupsForPatientQuery['riskAreaGroupsForPatient'];
}

type allProps = IGraphqlProps & IProps;

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

export default graphql(riskAreaGroupsForPatientQuery as any, {
  skip: (props: IProps) => props.history,
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    riskAreaGroups: data ? (data as any).riskAreaGroupsForPatient : null,
  }),
})(PatientThreeSixtyDomains);
