import { isAfter } from 'date-fns';
import { IFullRiskAreaGroupForPatient, IPriorityEnum, IRiskAreaForPatient } from 'schema';
import RiskAreaGroup from '../../models/risk-area-group';

interface IScreeningToolResultSummary {
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
  riskArea.screeningTools!.forEach(screeningTool => {
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
): IPriorityEnum | null => {
  return riskScore && riskScore.totalScore !== null
    ? riskScore.forceHighRisk || riskScore.totalScore >= highRiskThreshold
      ? ('high' as IPriorityEnum)
      : riskScore.totalScore >= mediumRiskThreshold
        ? ('medium' as IPriorityEnum)
        : ('low' as IPriorityEnum)
    : null;
};

export const formatRiskAreaGroupForPatient = (
  riskAreaGroup: RiskAreaGroup,
): IFullRiskAreaGroupForPatient => {
  let totalScore: number = 0;
  let forceHighRisk = false;
  let automatedSummaryText: string[] = [];
  let manualSummaryText: string[] = [];
  const screeningToolResultSummaries: IScreeningToolResultSummary[] = [];
  let lastUpdated = '';

  const riskAreas = riskAreaGroup.riskAreas.map(riskArea => {
    const isAutomated = riskArea.assessmentType === 'automated';
    const summaryText = isAutomated ? automatedSummaryText : manualSummaryText;
    const riskAreaSummaryStats = calculateRiskAreaSummaryStats(riskArea, {
      lastUpdated,
      totalScore,
      forceHighRisk,
      summaryText,
      screeningToolResultSummaries,
    });

    totalScore += riskAreaSummaryStats.totalScore ? riskAreaSummaryStats.totalScore : 0;
    // ensure we don't mark forceHighRiskFalse
    forceHighRisk = riskAreaSummaryStats.forceHighRisk ? true : false;
    screeningToolResultSummaries.concat(riskAreaSummaryStats.screeningToolResultSummaries || []);
    lastUpdated = isAfter(lastUpdated, riskAreaSummaryStats.lastUpdated)
      ? riskAreaSummaryStats.lastUpdated
      : lastUpdated;

    if (isAutomated) {
      automatedSummaryText = riskAreaSummaryStats.summaryText;
    } else {
      manualSummaryText = riskAreaSummaryStats.summaryText;
    }
    const riskAreaRiskScore = calculateRisk(
      {
        totalScore: riskAreaSummaryStats.totalScore,
        forceHighRisk: riskAreaSummaryStats.forceHighRisk,
      },
      riskArea.mediumRiskThreshold,
      riskArea.highRiskThreshold,
    );
    return {
      ...riskArea,
      lastUpdated,
      forceHighRisk,
      screeningToolResultSummaries,
      summaryText: automatedSummaryText || manualSummaryText,
      totalScore,
      riskScore: riskAreaRiskScore,
    };
  });

  const riskScore = calculateRisk(
    { totalScore: totalScore > 0 ? totalScore : null, forceHighRisk },
    riskAreaGroup.mediumRiskThreshold,
    riskAreaGroup.highRiskThreshold,
  );

  return {
    ...riskAreaGroup,
    riskAreas,
    automatedSummaryText,
    manualSummaryText,
    screeningToolResultSummaries,
    lastUpdated,
    totalScore: totalScore > 0 ? totalScore : null,
    forceHighRisk,
    riskScore,
  };
};
