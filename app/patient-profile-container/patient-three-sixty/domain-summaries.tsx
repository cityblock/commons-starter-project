import * as classNames from 'classnames';
import { size } from 'lodash';
import * as React from 'react';
import { getRiskAreaGroupsQuery } from '../../graphql/types';
import Spinner from '../../shared/library/spinner/spinner';
import * as styles from './css/shared.css';
import DomainSummary from './domain-summary';
import { calculateRisk } from './helpers';
import { IRiskAreaGroupScore } from './patient-three-sixty-domains';
import ThreeSixtyRadar from './three-sixty-radar/three-sixty-radar';

interface IProps {
  patientId: string;
  routeBase: string;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
  glassBreakId: string | null;
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
        id: group.id,
        title: group.shortTitle,
        mediumRiskThreshold: group.mediumRiskThreshold,
        highRiskThreshold: group.highRiskThreshold,
        ...this.state[group.id],
      };
    });
  }

  render(): JSX.Element {
    const { patientId, routeBase, riskAreaGroups, glassBreakId } = this.props;

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
          glassBreakId={glassBreakId}
        />
      );
    });

    const radarChart = this.isCalculating() ? (
      <Spinner className={styles.spinner} />
    ) : (
      <ThreeSixtyRadar riskAreaGroups={this.getRiskAreaGroupsForRadar()} />
    );

    return (
      <React.Fragment>
        <div className={classNames(styles.scroll, styles.domains)}>{domainSummaries}</div>
        {radarChart}
      </React.Fragment>
    );
  }
}

export default DomainSummaries;
