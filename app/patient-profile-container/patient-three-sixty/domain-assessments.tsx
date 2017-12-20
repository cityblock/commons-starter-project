import * as classNames from 'classnames';
import * as React from 'react';
import { graphql } from 'react-apollo';
/* tslint:disable:max-line-length */
import * as getRiskAreaGroupForPatientGraphql from '../../graphql/queries/get-risk-area-group-for-patient.graphql';
/* tsline:enable:max-line-length */
import { getRiskAreaGroupForPatientQuery } from '../../graphql/types';
import BackLink from '../../shared/library/back-link/back-link';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import * as styles from './css/shared.css';
import DomainAssessmentsList from './domain-assessments-list';

interface IProps {
  routeBase: string;
  patientId: string;
  riskAreaGroupId: string;
}

interface IGraphqlProps {
  loading?: boolean;
  error?: string | null;
  riskAreaGroup: getRiskAreaGroupForPatientQuery['riskAreaGroupForPatient'];
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
      <div>
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
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(getRiskAreaGroupForPatientGraphql as any, {
  options: (props: IProps) => {
    const { riskAreaGroupId, patientId } = props;
    return { variables: { riskAreaGroupId, patientId } };
  },
  props: ({ data }) => ({
    loading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroup: data ? (data as any).riskAreaGroupForPatient : null,
  }),
})(DomainAssessments);
