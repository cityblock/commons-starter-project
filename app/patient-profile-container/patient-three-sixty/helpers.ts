import { IRiskAreaGroupScore } from './patient-three-sixty-domains';

type Risk = 'low' | 'medium' | 'high' | null;

export const calculateRisk = (
  riskScore: IRiskAreaGroupScore | null,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
): Risk => {
  return riskScore && riskScore.totalScore !== null
    ? riskScore.forceHighRisk || riskScore.totalScore >= highRiskThreshold
      ? 'high'
      : riskScore.totalScore >= mediumRiskThreshold ? 'medium' : 'low'
    : null;
};
