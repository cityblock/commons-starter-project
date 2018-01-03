import * as classNames from 'classnames';
import { size } from 'lodash';
import * as React from 'react';
import * as Loadable from 'react-loadable';
import { getRiskAreaGroupsQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/shared.css';
import DomainSummary from './domain-summary';
import { calculateRisk } from './helpers';
import { IRiskAreaGroupScore } from './patient-three-sixty-domains';

export const LoadableThreeSixtyRadar = (Loadable as any)({
  loader: async () =>
    import(/* webpackChunkName: "radarChart" */
    './three-sixty-radar/three-sixty-radar'),
  loading: () => null,
});

interface IProps {
  patientId: string;
  routeBase: string;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
}

interface IState {
  [riskAreaGroupId: string]: IRiskAreaGroupScore;
}

class DomainSummaries extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
    this.state = {};
  }

  updateRiskAreaGroupScore = (
    riskAreaGroupId: string,
    riskAreaGroupScore: IRiskAreaGroupScore,
  ): void => {
    this.setState({ [riskAreaGroupId]: riskAreaGroupScore });
  };

  isCalculating(): boolean {
    const { riskAreaGroups } = this.props;
    return !(size(this.state) === riskAreaGroups.length);
  }

  getRiskAreaGroupsForRadar() {
    if (this.isCalculating()) return [];
    const { riskAreaGroups } = this.props;

    return riskAreaGroups.map(group => {
      return {
        title: group.title,
        mediumRiskThreshold: group.mediumRiskThreshold,
        highRiskThreshold: group.highRiskThreshold,
        ...this.state[group.id],
      };
    });
  }

  render(): JSX.Element {
    const { patientId, routeBase, riskAreaGroups } = this.props;

    const domainSummaries = riskAreaGroups.map(group => {
      const { mediumRiskThreshold, highRiskThreshold } = group;

      const riskScore = this.state[group.id];
      const risk = calculateRisk(riskScore, mediumRiskThreshold, highRiskThreshold);

      return (
        <DomainSummary
          key={group.id}
          routeBase={routeBase}
          patientId={patientId}
          riskAreaGroupId={group.id}
          risk={risk}
          updateRiskAreaGroupScore={this.updateRiskAreaGroupScore}
        />
      );
    });

    const radarChart = this.isCalculating() ? (
      <Spinner className={styles.spinner} />
    ) : (
      <LoadableThreeSixtyRadar riskAreaGroups={this.getRiskAreaGroupsForRadar()} />
    );

    return (
      <div className={styles.flex}>
        <div className={classNames(styles.scroll, styles.domains)}>{domainSummaries}</div>
        {radarChart}
      </div>
    );
  }
}

export default DomainSummaries;
