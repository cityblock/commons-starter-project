import * as React from 'react';
import { getRiskAreaGroupsQuery } from '../../graphql/types';
import * as styles from './css/shared.css';
import DomainSummary from './domain-summary';
import { IRiskAreaGroupScore } from './patient-three-sixty-domains';

interface IProps {
  patientId: string;
  routeBase: string;
  riskAreaGroups: getRiskAreaGroupsQuery['riskAreaGroups'];
  updateRiskAreaGroupScore: (
    riskAreaGroupId: string,
    riskAreaGroupScore: IRiskAreaGroupScore,
  ) => void;
  riskAreaGroupScores: {
    [riskAreaGroupId: string]: IRiskAreaGroupScore;
  };
}

const DomainSummaries: React.StatelessComponent<IProps> = (props: IProps) => {
  const {
    patientId,
    routeBase,
    riskAreaGroups,
    updateRiskAreaGroupScore,
    riskAreaGroupScores,
  } = props;

  const domainSummaries = riskAreaGroups.map(group => {
    const { mediumRiskThreshold, highRiskThreshold } = group;

    const riskScore = riskAreaGroupScores[group.id];
    const risk =
      riskScore && (riskScore.totalScore || riskScore.totalScore === 0)
        ? riskScore.forceHighRisk || riskScore.totalScore >= highRiskThreshold
          ? 'high'
          : riskScore.totalScore >= mediumRiskThreshold ? 'medium' : 'low'
        : null;

    return (
      <DomainSummary
        key={group.id}
        routeBase={routeBase}
        patientId={patientId}
        riskAreaGroupId={group.id}
        risk={risk}
        updateRiskAreaGroupScore={updateRiskAreaGroupScore}
      />
    );
  });

  return <div className={styles.scroll}>{domainSummaries}</div>;
};

export default DomainSummaries;
