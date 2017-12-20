import * as React from 'react';
import { graphql } from 'react-apollo';
/* tslint:enable:max-line-length */
import * as riskAreaGroupsQuery from '../../graphql/queries/get-risk-area-groups.graphql';
/* tslint:disable:max-line-length */
import { getRiskAreaGroupsQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import UnderlineTab from '../../shared/library/underline-tab/underline-tab';
import UnderlineTabs from '../../shared/library/underline-tabs/underline-tabs';
import * as styles from './css/patient-three-sixty-domains.css';
import DomainSummaries from './domain-summaries';

interface IProps {
  patientId: string;
  routeBase: string;
}

interface IGraphqlProps {
  riskAreaGroupsLoading?: boolean;
  error?: string | null;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
}

type allProps = IGraphqlProps & IProps;

export interface IRiskAreaGroupScore {
  totalScore: number;
  forceHighRisk: boolean;
}

interface IState {
  [riskAreaGroupId: string]: IRiskAreaGroupScore;
}

export class PatientThreeSixtyDomains extends React.Component<allProps, IState> {
  constructor(props: allProps) {
    super(props);
    this.state = {};
  }

  updateRiskAreaGroupScore = (
    riskAreaGroupId: string,
    riskAreaGroupScore: IRiskAreaGroupScore,
  ): void => {
    this.setState({ [riskAreaGroupId]: riskAreaGroupScore });
  };

  render(): JSX.Element {
    const { patientId, routeBase, riskAreaGroups, riskAreaGroupsLoading } = this.props;
    if (riskAreaGroupsLoading) return <Spinner className={styles.spinner} />;

    return (
      <div className={styles.container}>
        <UnderlineTabs>
          <UnderlineTab messageId="threeSixty.summary" selected={true} href={routeBase} />
          <UnderlineTab messageId="threeSixty.history" selected={false} href={routeBase} />
        </UnderlineTabs>
        <div className={styles.body}>
          <div className={styles.domains}>
            <DomainSummaries
              patientId={patientId}
              routeBase={routeBase}
              riskAreaGroups={riskAreaGroups}
              updateRiskAreaGroupScore={this.updateRiskAreaGroupScore}
              riskAreaGroupScores={this.state}
            />
          </div>
        </div>
      </div>
    );
  }
}

export default graphql<IGraphqlProps, IProps, allProps>(riskAreaGroupsQuery as any, {
  props: ({ data }) => ({
    riskAreaGroupsLoading: data ? data.loading : false,
    error: data ? data.error : null,
    riskAreaGroups: data ? (data as any).riskAreaGroups : null,
  }),
})(PatientThreeSixtyDomains);
