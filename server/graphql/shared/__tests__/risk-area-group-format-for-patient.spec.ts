import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';

import Answer from '../../../models/answer';
import Clinic from '../../../models/clinic';
import Patient from '../../../models/patient';
import PatientAnswer from '../../../models/patient-answer';
import PatientScreeningToolSubmission from '../../../models/patient-screening-tool-submission';
import Question from '../../../models/question';
import RiskArea from '../../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../../models/risk-area-assessment-submission';
import RiskAreaGroup from '../../../models/risk-area-group';
import ScreeningTool from '../../../models/screening-tool';
import User from '../../../models/user';
import { createMockClinic, createMockUser, createPatient } from '../../../spec-helpers';
import {
  calculateRisk,
  calculateRiskAreaSummaryStats,
  formatRiskAreaGroupForPatient,
} from '../risk-area-group-format-for-patient';

interface ISetup {
  user: User;
  riskAreaGroup: RiskAreaGroup;
  clinic: Clinic;
  riskArea: RiskArea;
  question: Question;
  answer: Answer;
  answer2: Answer;
  patient: Patient;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

const userRole = 'admin' as UserRole;

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskAreaGroup = await RiskAreaGroup.create(
    {
      title: 'risk area group',
      shortTitle: 'short',
      order: 1,
      mediumRiskThreshold: 3,
      highRiskThreshold: 4,
    },
    txn,
  );
  const riskArea = await RiskArea.create(
    {
      title: 'Risk Area',
      riskAreaGroupId: riskAreaGroup.id,
      assessmentType: 'manual' as any,
      order: 1,
      mediumRiskThreshold: 3,
      highRiskThreshold: 4,
    },
    txn,
  );
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: true,
      questionId: question.id,
      summaryText: 'omg summary',
      order: 1,
    },
    txn,
  );
  const answer2 = await Answer.create(
    {
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 2,
    },
    txn,
  );
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    riskArea,
    riskAreaGroup,
    question,
    answer,
    answer2,
    user,
    patient,
    clinic,
    riskAreaAssessmentSubmission,
  };
}

describe('risk area group format', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });
  afterEach(async () => {
    await txn.rollback();
  });

  describe('calculate risk', () => {
    it('works if blank', () => {
      expect(calculateRisk(null, 2, 3)).toBeFalsy();
    });
    it('should be high if force high risk', () => {
      expect(
        calculateRisk(
          {
            totalScore: 0,
            forceHighRisk: true,
          },
          2,
          3,
        ),
      ).toEqual('high');
    });
    it('should be low if below scores', () => {
      expect(
        calculateRisk(
          {
            totalScore: 0,
            forceHighRisk: false,
          },
          2,
          3,
        ),
      ).toEqual('low');
    });
    it('should be high if score is above high risk threshold', () => {
      expect(
        calculateRisk(
          {
            totalScore: 3,
            forceHighRisk: false,
          },
          2,
          3,
        ),
      ).toEqual('high');
    });
    it('should be medium if score is between medium and high threshold', () => {
      expect(
        calculateRisk(
          {
            totalScore: 2,
            forceHighRisk: false,
          },
          2,
          3,
        ),
      ).toEqual('medium');
    });
  });

  describe('calculate risk area summary stats', () => {
    it('includes answer summaries', async () => {
      const { patient, riskAreaAssessmentSubmission, answer, user, riskAreaGroup } = await setup(
        txn,
      );

      const patientAnswers = await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const lastUpdated = new Date().toISOString();
      const riskAreaGroupForPatient = await RiskAreaGroup.getForPatient(
        riskAreaGroup.id,
        patient.id,
        txn,
      );

      expect(
        calculateRiskAreaSummaryStats(riskAreaGroupForPatient.riskAreas[0], {
          lastUpdated,
          totalScore: null,
          forceHighRisk: false,
          summaryText: [],
          screeningToolResultSummaries: [],
        }),
      ).toEqual({
        forceHighRisk: true,
        lastUpdated,
        screeningToolResultSummaries: [],
        summaryText: ['omg summary'],
        totalScore: 0,
      });
      // uses patient answer.updatedAt if summary stats is earlier
      expect(
        calculateRiskAreaSummaryStats(riskAreaGroupForPatient.riskAreas[0], {
          lastUpdated: new Date('1990-01-01 00:10:00').toISOString(),
          totalScore: null,
          forceHighRisk: false,
          summaryText: [],
          screeningToolResultSummaries: [],
        }),
      ).toEqual({
        forceHighRisk: true,
        lastUpdated: patientAnswers[0].updatedAt,
        screeningToolResultSummaries: [],
        summaryText: ['omg summary'],
        totalScore: 0,
      });
    });
    it('includes screening tools summaries', async () => {
      const { patient, user, riskArea, riskAreaGroup } = await setup(txn);
      const oldLastUpdated = new Date('1990-01-01 00:10:00').toISOString();

      const screeningTool = await ScreeningTool.create(
        {
          title: 'Screening Tool',
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool.id,
        },
        txn,
      );
      const screeningToolQuestion = await Question.create(
        {
          title: 'like writing tests again?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          type: 'screeningTool',
          order: 1,
        },
        txn,
      );
      const screeningToolAnswer = await Answer.create(
        {
          displayValue: 'loves writing more tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: screeningToolQuestion.id,
          order: 1,
        },
        txn,
      );
      const patientAnswers = await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'patientScreeningToolSubmission',
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
          questionIds: [screeningToolAnswer.questionId],
          answers: [
            {
              questionId: screeningToolAnswer.questionId,
              answerId: screeningToolAnswer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const riskAreaGroupForPatientWithoutSubmission = await RiskAreaGroup.getForPatient(
        riskAreaGroup.id,
        patient.id,
        txn,
      );
      // ensure it works without a submission
      expect(
        calculateRiskAreaSummaryStats(riskAreaGroupForPatientWithoutSubmission.riskAreas[0], {
          lastUpdated: oldLastUpdated,
          totalScore: null,
          forceHighRisk: false,
          summaryText: [],
          screeningToolResultSummaries: [],
        }),
      ).toEqual({
        forceHighRisk: false,
        lastUpdated: oldLastUpdated,
        screeningToolResultSummaries: [],
        summaryText: [],
        totalScore: null,
      });

      await PatientScreeningToolSubmission.submitScore(
        patientScreeningToolSubmission.id,
        {
          patientAnswers,
        },
        txn,
      );

      const riskAreaGroupForPatient = await RiskAreaGroup.getForPatient(
        riskAreaGroup.id,
        patient.id,
        txn,
      );
      expect(
        calculateRiskAreaSummaryStats(riskAreaGroupForPatient.riskAreas[0], {
          lastUpdated: oldLastUpdated,
          totalScore: null,
          forceHighRisk: false,
          summaryText: [],
          screeningToolResultSummaries: [],
        }),
      ).toEqual({
        forceHighRisk: true,
        lastUpdated: patientAnswers[0].updatedAt,
        screeningToolResultSummaries: [
          {
            description: '',
            score: 3,
            title: 'Screening Tool',
          },
        ],
        summaryText: [],
        totalScore: 0,
      });
    });
  });

  describe('format for patient', () => {
    it('calculates correct risk score if multiple risk areas in risk area group', async () => {
      const {
        patient,
        riskAreaAssessmentSubmission,
        answer,
        user,
        riskAreaGroup,
        riskArea,
      } = await setup(txn);

      await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'riskAreaAssessmentSubmission',
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer.questionId],
          answers: [
            {
              questionId: answer.questionId,
              answerId: answer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const screeningTool = await ScreeningTool.create(
        {
          title: 'Screening Tool',
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const patientScreeningToolSubmission = await PatientScreeningToolSubmission.create(
        {
          patientId: patient.id,
          userId: user.id,
          screeningToolId: screeningTool.id,
        },
        txn,
      );
      const screeningToolQuestion = await Question.create(
        {
          title: 'like writing tests again?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          type: 'screeningTool',
          order: 1,
        },
        txn,
      );
      const screeningToolAnswer = await Answer.create(
        {
          displayValue: 'loves writing more tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: screeningToolQuestion.id,
          order: 1,
        },
        txn,
      );
      const patientAnswersForScreeningTool = await PatientAnswer.create(
        {
          patientId: patient.id,
          type: 'patientScreeningToolSubmission',
          patientScreeningToolSubmissionId: patientScreeningToolSubmission.id,
          questionIds: [screeningToolAnswer.questionId],
          answers: [
            {
              questionId: screeningToolAnswer.questionId,
              answerId: screeningToolAnswer.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      await PatientScreeningToolSubmission.submitScore(
        patientScreeningToolSubmission.id,
        {
          patientAnswers: patientAnswersForScreeningTool,
        },
        txn,
      );

      const riskAreaGroupForPatient = await RiskAreaGroup.getForPatient(
        riskAreaGroup.id,
        patient.id,
        txn,
      );
      const result = formatRiskAreaGroupForPatient(riskAreaGroupForPatient);
      expect(result.screeningToolResultSummaries).toEqual([
        {
          description: '',
          score: 3,
          title: 'Screening Tool',
        },
      ]);
      expect(result.manualSummaryText).toEqual(['omg summary']);
      expect(result.automatedSummaryText).toEqual([]);
    });
  });
});
