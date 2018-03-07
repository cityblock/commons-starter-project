import { isAfter } from 'date-fns';
import { FullRiskAreaForPatientFragment } from '../../graphql/types';
import { IRiskAreaGroupScore } from './patient-three-sixty-domains';

type Risk = 'low' | 'medium' | 'high' | null;

export interface IScreeningToolResultSummary {
  title: string;
  score: number | null;
  description: string;
}

interface ISummaryStats {
  lastUpdated: string;
  totalScore: number | null;
  forceHighRisk: boolean;
  summaryText: string[];
  screeningToolResultSummaries?: IScreeningToolResultSummary[];
}

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

export const calculateRiskAreaSummaryStats = (
  riskArea: FullRiskAreaForPatientFragment,
  summaryStats: ISummaryStats,
): ISummaryStats => {
  let { lastUpdated, totalScore, forceHighRisk, screeningToolResultSummaries } = summaryStats;
  const { summaryText } = summaryStats;

  riskArea.questions.forEach(question => {
    question.answers!.forEach(answer => {
      if (answer.patientAnswers && answer.patientAnswers.length) {
        answer.patientAnswers.forEach(patientAnswer => {
          if (totalScore === null) totalScore = 0;

          if (!lastUpdated || isAfter(patientAnswer.updatedAt, lastUpdated)) {
            lastUpdated = patientAnswer.updatedAt;
          }

          if (answer.riskAdjustmentType === 'forceHighRisk') {
            forceHighRisk = true;
          } else if (answer.riskAdjustmentType === 'increment') {
            totalScore++;
          }

          if (answer.inSummary && answer.summaryText && !summaryText.includes(answer.summaryText)) {
            summaryText.push(answer.summaryText);
          }
        });
      }
    });
  });
  riskArea.screeningTools.forEach(screeningTool => {
    const { title } = screeningTool;
    screeningTool.patientScreeningToolSubmissions.forEach(submission => {
      const { screeningToolScoreRange, patientAnswers, score } = submission;
      let toolDescription = '';

      if (screeningToolScoreRange) {
        const { riskAdjustmentType, description } = screeningToolScoreRange;
        toolDescription = description;

        if (riskAdjustmentType === 'forceHighRisk') {
          forceHighRisk = true;
        } else if (riskAdjustmentType === 'increment') {
          if (totalScore === null) totalScore = 0;
          totalScore++;
        }
      }

      if (!screeningToolResultSummaries) screeningToolResultSummaries = [];
      screeningToolResultSummaries.push({
        score,
        description: toolDescription,
        title,
      });

      if (patientAnswers && patientAnswers.length) {
        patientAnswers.forEach(patientAnswer => {
          const { answer } = patientAnswer;

          if (totalScore === null) totalScore = 0;

          if (!lastUpdated || isAfter(patientAnswer.updatedAt, lastUpdated)) {
            lastUpdated = patientAnswer.updatedAt;
          }

          if (answer.riskAdjustmentType === 'forceHighRisk') {
            forceHighRisk = true;
          } else if (answer.riskAdjustmentType === 'increment') {
            totalScore++;
          }

          if (answer.inSummary && answer.summaryText && !summaryText.includes(answer.summaryText)) {
            summaryText.push(answer.summaryText);
          }
        });
      }
    });
  });

  return {
    lastUpdated,
    totalScore,
    forceHighRisk,
    summaryText,
    screeningToolResultSummaries: screeningToolResultSummaries || [],
  };
};
