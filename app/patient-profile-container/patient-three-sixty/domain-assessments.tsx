import { ApolloError } from 'apollo-client';
import classNames from 'classnames';
import React from 'react';
import { graphql } from 'react-apollo';
import getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
import { getRiskAreaGroupForPatient } from '../../graphql/types';
import BackLink from '../../shared/library/back-link/back-link';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import styles from './css/shared.css';
import DomainAssessmentsList from './domain-assessments-list';

interface IProps {
  routeBase: string;
  patientId: string;
  riskAreaGroupId: string;
  glassBreakId: string | null;
}

interface IGraphqlProps {
  loading: boolean;
  error: ApolloError | null | undefined;
  riskAreaGroup: getRiskAreaGroupForPatient['riskAreaGroupForPatient'];
}

type allProps = IGraphqlProps & IProps;

export class DomainAssessments extends React.Component<allProps, {}> {
  getAssessments(assessmentType: 'automated' | 'manual') {
    const { riskAreaGroup } = this.props;
    if (!riskAreaGroup || !riskAreaGroup.riskAreas) return [];
    return riskAreaGroup.riskAreas.filter(area => area.assessmentType === assessmentType);
  }

  render(): JSX.Element {
    const { loading, routeBase, riskAreaGroupId } = this.props;
    if (loading) return <Spinner className={styles.spinner} />;

    const updatedRouteBase = `${routeBase}/${riskAreaGroupId}`;

    return (
      <React.Fragment>
        <UnderlineTabs>
          <BackLink href={routeBase} messageId="threeSixty.back" />
        </UnderlineTabs>
        <div className={classNames(styles.scroll, styles.body)}>
          <DomainAssessmentsList
            routeBase={updatedRouteBase}
            assessmentType="automated"
            riskAreas={this.getAssessments('automated')}
          />
          <DomainAssessmentsList
            routeBase={updatedRouteBase}
            assessmentType="manual"
            riskAreas={this.getAssessments('manual')}
          />
        </div>
      </React.Fragment>
    );
  }
}

export default graphql(getRiskAreaGroupForPatientGraphql, {
  options: (props: IProps) => {
    const { riskAreaGroupId, patientId, glassBreakId } = props;
    return { variables: { riskAreaGroupId, patientId, glassBreakId }, fetchPolicy: 'network-only' };
  },
  props: ({ data }): IGraphqlProps => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(DomainAssessments);
