import { isAfter } from 'date-fns';
import { IFullRiskAreaGroupForPatient, IRiskAreaForPatient, Priority } from 'schema';
import RiskAreaGroup from '../../models/risk-area-group';

interface IScreeningToolResultSummary {
  title: string;
  score: number | null;
  description: string;
}

interface ISummaryStats {
  lastUpdated: string | null;
  totalScore: number | null;
  forceHighRisk: boolean;
  summaryText: string[];
  screeningToolResultSummaries?: IScreeningToolResultSummary[];
}

interface IRiskAreaGroupScore {
  totalScore: number | null;
  forceHighRisk: boolean;
}

export const calculateRiskAreaSummaryStats = (
  riskArea: Partial<IRiskAreaForPatient>,
  summaryStats: ISummaryStats,
): ISummaryStats => {
  let { lastUpdated, totalScore, forceHighRisk, screeningToolResultSummaries } = summaryStats;
  const { summaryText } = summaryStats;
  (riskArea.questions || []).forEach(question => {
    question.answers.forEach(answer => {
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
  (riskArea.screeningTools || []).forEach(screeningTool => {
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

export const calculateRisk = (
  riskScore: IRiskAreaGroupScore | null,
  mediumRiskThreshold: number,
  highRiskThreshold: number,
): Priority | null => {
  return riskScore && riskScore.totalScore !== null
    ? riskScore.forceHighRisk || riskScore.totalScore >= highRiskThreshold
      ? ('high' as Priority)
      : riskScore.totalScore >= mediumRiskThreshold
        ? ('medium' as Priority)
        : ('low' as Priority)
    : null;
};

export const formatRiskAreaGroupForPatient = (
  riskAreaGroup: RiskAreaGroup,
): IFullRiskAreaGroupForPatient => {
  let automatedSummaryTextForRiskAreaGroup: string[] = [];
  let manualSummaryTextForRiskAreaGroup: string[] = [];
  let screeningToolResultSummariesForRiskAreaGroup: IScreeningToolResultSummary[] = [];
  let riskAreaGroupLastUpdated: string | null = null;

  const riskAreas = riskAreaGroup.riskAreas.map(riskArea => {
    const isAutomated = riskArea.assessmentType === 'automated';
    const summaryText: string[] = [];
    const screeningToolResultSummaries: IScreeningToolResultSummary[] = [];
    const riskAreaSummaryStats = calculateRiskAreaSummaryStats(riskArea, {
      lastUpdated: null,
      totalScore: 0,
      forceHighRisk: false,
      summaryText,
      screeningToolResultSummaries,
    });

    // Update the risk area group last updated
    riskAreaGroupLastUpdated =
      riskAreaSummaryStats.lastUpdated &&
      isAfter(riskAreaSummaryStats.lastUpdated, riskAreaGroupLastUpdated || new Date(0))
        ? riskAreaSummaryStats.lastUpdated
        : riskAreaGroupLastUpdated;

    if (isAutomated) {
      automatedSummaryTextForRiskAreaGroup = automatedSummaryTextForRiskAreaGroup.concat(
        riskAreaSummaryStats.summaryText,
      );
    } else {
      manualSummaryTextForRiskAreaGroup = manualSummaryTextForRiskAreaGroup.concat(
        riskAreaSummaryStats.summaryText,
      );
    }

    // Add screeningToolSummaries to risk area group summaries
    screeningToolResultSummariesForRiskAreaGroup = screeningToolResultSummariesForRiskAreaGroup.concat(
      screeningToolResultSummaries,
    );

    const riskAreaRiskScore = riskAreaSummaryStats.lastUpdated
      ? calculateRisk(
          {
            totalScore: riskAreaSummaryStats.totalScore,
            forceHighRisk: riskAreaSummaryStats.forceHighRisk,
          },
          riskArea.mediumRiskThreshold,
          riskArea.highRiskThreshold,
        )
      : null;
    return {
      ...riskArea,
      lastUpdated: riskAreaSummaryStats.lastUpdated,
      forceHighRisk: riskAreaSummaryStats.forceHighRisk,
      totalScore: riskAreaSummaryStats.totalScore,
      screeningToolResultSummaries: riskAreaSummaryStats.screeningToolResultSummaries,
      summaryText: riskAreaSummaryStats.summaryText,
      riskScore: riskAreaRiskScore,
    };
  });

  const riskAreaGroupTotalScore = riskAreas
    .map(a => (a.totalScore && a.totalScore > 0 ? a.totalScore : 0))
    .reduce((a, currentValue) => a + currentValue);

  const riskAreaGroupForceHighRisk = riskAreas
    .map(a => a.forceHighRisk)
    .reduce((a, currentValue) => (a ? true : currentValue));

  const riskScore = riskAreaGroupLastUpdated
    ? calculateRisk(
        {
          totalScore: riskAreaGroupTotalScore > 0 ? riskAreaGroupTotalScore : null,
          forceHighRisk: riskAreaGroupForceHighRisk,
        },
        riskAreaGroup.mediumRiskThreshold,
        riskAreaGroup.highRiskThreshold,
      )
    : null;

  return {
    ...riskAreaGroup,
    riskAreas,
    automatedSummaryText: automatedSummaryTextForRiskAreaGroup,
    manualSummaryText: manualSummaryTextForRiskAreaGroup,
    screeningToolResultSummaries: screeningToolResultSummariesForRiskAreaGroup,
    lastUpdated: riskAreaGroupLastUpdated,
    totalScore: riskAreaGroupTotalScore > 0 ? riskAreaGroupTotalScore : null,
    forceHighRisk: riskAreaGroupForceHighRisk,
    riskScore,
  };
};
