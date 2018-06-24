import React from 'react';
import { graphql } from 'react-apollo';
import riskAreaGroupsForPatient from '../../graphql/queries/get-risk-area-groups-for-patient.graphql';
import { getRiskAreaGroupsForPatient } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import styles from './css/shared.css';
import { DomainSummaries } from './domain-summaries';

export const HISTORY_ROUTE = 'history';

interface IProps {
  patientId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  riskAreaGroups: getRiskAreaGroupsForPatient['riskAreaGroupsForPatient'];
}

type allProps = IGraphqlProps & IProps;

export const PatientThreeSixtyDomains: React.StatelessComponent<allProps> = (props: allProps) => {
  const { patientId, riskAreaGroups, loading, glassBreakId } = props;
  if (loading) return <Spinner />;

  const routeBase = `/patients/${patientId}/360`;

  return (
    <React.Fragment>
      <UnderlineTabs className={styles.navBar}>
        <UnderlineTab messageId="threeSixty.summary" selected={true} href={routeBase} />
        <UnderlineTab
          messageId="threeSixty.history"
          selected={false}
          href={`${routeBase}/${HISTORY_ROUTE}`}
        />
      </UnderlineTabs>
      <div className={styles.bodyFlex}>
        <DomainSummaries
          patientId={patientId}
          routeBase={routeBase}
          riskAreaGroups={riskAreaGroups || []}
          glassBreakId={glassBreakId}
        />
      </div>
    </React.Fragment>
  );
};

export default graphql(riskAreaGroupsForPatient, {
  options: (props: IProps) => ({
    variables: {
      patientId: props.patientId,
    },
    fetchPolicy: 'network-only',
  }),
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    riskAreaGroups: data ? (data as any).riskAreaGroupsForPatient : null,
  }),
})(PatientThreeSixtyDomains);
