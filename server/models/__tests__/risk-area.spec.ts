import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  AssessmentType,
  RiskAdjustmentTypeOptions,
} from 'schema';
import uuid from 'uuid/v4';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import RiskAreaAssessmentSubmission from '../../models/risk-area-assessment-submission';
import RiskAreaGroup from '../../models/risk-area-group';
import User from '../../models/user';
import {
  createMockClinic,
  createMockRiskAreaGroup,
  createMockUser,
  createPatient,
} from '../../spec-helpers';

interface ISetup {
  riskAreaGroup: RiskAreaGroup;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskAreaGroup = await RiskAreaGroup.create(createMockRiskAreaGroup(), txn);
  return { riskAreaGroup };
}

const mediumRiskThreshold = 5;
const highRiskThreshold = 8;
const assessmentType = 'manual' as AssessmentType;

interface ISetup2 {
  question: Question;
  patient: Patient;
  riskArea: RiskArea;
  user: User;
  clinic: Clinic;
  riskAreaAssessmentSubmission: RiskAreaAssessmentSubmission;
}

async function setup2(riskAreaGroup: RiskAreaGroup, txn: Transaction): Promise<ISetup2> {
  const riskArea = await RiskArea.create(
    {
      title: 'testing',
      order: 1,
      mediumRiskThreshold,
      highRiskThreshold,
      assessmentType,
      riskAreaGroupId: riskAreaGroup.id,
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
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const riskAreaAssessmentSubmission = await RiskAreaAssessmentSubmission.create(
    {
      patientId: patient.id,
      userId: user.id,
      riskAreaId: riskArea.id,
    },
    txn,
  );
  return { riskArea, question, clinic, user, patient, riskAreaAssessmentSubmission };
}

describe('risk area model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should creates and get a risk area', async () => {
    const { riskAreaGroup } = await setup(txn);

    const riskArea = await RiskArea.create(
      {
        title: 'Housing',
        order: 1,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    expect(riskArea.title).toEqual('Housing');
    expect(riskArea.mediumRiskThreshold).toBe(mediumRiskThreshold);
    expect(riskArea.highRiskThreshold).toBe(highRiskThreshold);
    const fetchedRiskArea = await RiskArea.get(riskArea.id, txn);
    expect(fetchedRiskArea).toMatchObject(riskArea);
    expect(fetchedRiskArea.riskAreaGroup).toMatchObject(riskAreaGroup);
  });

  it('should throw an error if a risk area does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(RiskArea.get(fakeId, txn)).rejects.toMatch(`No such risk area: ${fakeId}`);
  });

  it('edits risk area', async () => {
    const { riskAreaGroup } = await setup(txn);

    const riskArea = await RiskArea.create(
      {
        title: 'Housing',
        order: 1,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    expect(riskArea.title).toEqual('Housing');
    const editedRiskArea = await RiskArea.edit(
      {
        title: 'Mental Health',
        mediumRiskThreshold: 6,
        assessmentType: 'automated' as AssessmentType,
      },
      riskArea.id,
      txn,
    );
    expect(editedRiskArea.title).toEqual('Mental Health');
    expect(editedRiskArea.mediumRiskThreshold).toBe(6);
    expect(editedRiskArea.assessmentType).toBe('automated');
  });

  it('get all risk areas', async () => {
    const { riskAreaGroup } = await setup(txn);

    const riskArea = await RiskArea.create(
      {
        title: 'Housing',
        order: 1,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    const riskArea2 = await RiskArea.create(
      {
        title: 'Housing',
        order: 1,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    // created before next one but with a later title
    const riskArea3 = await RiskArea.create(
      {
        title: 'Housing 3',
        order: 2,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    const riskArea4 = await RiskArea.create(
      {
        title: 'Housing 2',
        order: 2,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );

    expect(riskArea.deletedAt).toBeFalsy();
    const deleted = await RiskArea.delete(riskArea.id, txn);
    expect(deleted.deletedAt).not.toBeFalsy();

    // ensure order is correct
    expect(await RiskArea.getAll(txn)).toMatchObject([riskArea2, riskArea4, riskArea3]);
  });

  it('deleted risk area', async () => {
    const { riskAreaGroup } = await setup(txn);

    const riskArea = await RiskArea.create(
      {
        title: 'Housing',
        order: 1,
        mediumRiskThreshold,
        highRiskThreshold,
        assessmentType,
        riskAreaGroupId: riskAreaGroup.id,
      },
      txn,
    );
    expect(riskArea.deletedAt).toBeFalsy();
    const deleted = await RiskArea.delete(riskArea.id, txn);
    expect(deleted.deletedAt).not.toBeFalsy();
  });

  describe('questions with patient answers', () => {
    it('gets summary for patient', async () => {
      const { riskAreaGroup } = await setup(txn);
      const { riskArea, question, patient, user, riskAreaAssessmentSubmission } = await setup2(
        riskAreaGroup,
        txn,
      );

      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
      expect(await RiskArea.getSummaryForPatient(riskArea.id, patient.id, txn)).toMatchObject({
        started: true,
        summary: ['summary text!'],
      });
    });

    it('gets increment and high risk score for patient', async () => {
      const { riskAreaGroup } = await setup(txn);
      const { riskArea, question, patient, user, riskAreaAssessmentSubmission } = await setup2(
        riskAreaGroup,
        txn,
      );

      const answer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 2,
        },
        txn,
      );
      const highRiskAnswer = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'summary text!',
          questionId: question2.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
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
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [highRiskAnswer.questionId],
          answers: [
            {
              questionId: highRiskAnswer.questionId,
              answerId: highRiskAnswer.id,
              answerValue: '4',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );
      expect(await RiskArea.getRiskScoreForPatient(riskArea.id, patient.id, txn)).toEqual({
        score: 1,
        forceHighRisk: true,
      });
    });

    it('gets a full 360 degree summary for a patient', async () => {
      const { riskAreaGroup } = await setup(txn);
      const { riskArea, question, patient, user, riskAreaAssessmentSubmission } = await setup2(
        riskAreaGroup,
        txn,
      );

      const riskArea2 = await RiskArea.create(
        {
          title: 'risk area 2',
          order: 2,
          mediumRiskThreshold,
          highRiskThreshold,
          assessmentType,
          riskAreaGroupId: riskAreaGroup.id,
        },
        txn,
      );
      const question2 = await Question.create(
        {
          title: 'hate writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 2,
        },
        txn,
      );
      const question3 = await Question.create(
        {
          title: 'really hate writing tests?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea2.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const answer1 = await Answer.create(
        {
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'loves writing tests summary text!',
          questionId: question.id,
          order: 1,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          displayValue: 'hates writing tests!',
          value: '4',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'hates writing tests summary text!',
          questionId: question2.id,
          order: 1,
        },
        txn,
      );
      const answer3 = await Answer.create(
        {
          displayValue: 'really hates writing tests!',
          value: '5',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: true,
          summaryText: 'really hates writing tests summary text!',
          questionId: question3.id,
          order: 1,
        },
        txn,
      );
      await PatientAnswer.createForRiskArea(
        {
          patientId: patient.id,
          riskAreaAssessmentSubmissionId: riskAreaAssessmentSubmission.id,
          questionIds: [answer1.questionId, answer2.id, answer3.id],
          answers: [
            {
              questionId: answer1.questionId,
              answerId: answer1.id,
              answerValue: '3',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
            {
              questionId: answer2.questionId,
              answerId: answer2.id,
              answerValue: '4',
              patientId: patient.id,
              applicable: false,
              userId: user.id,
            },
            {
              questionId: answer3.questionId,
              answerId: answer3.id,
              answerValue: '5',
              patientId: patient.id,
              applicable: true,
              userId: user.id,
            },
          ],
        },
        txn,
      );

      const fullThreeSixtySummary = await RiskArea.getThreeSixtySummaryForPatient(patient.id, txn);
      expect(fullThreeSixtySummary.riskAreas.length).toEqual(2);

      expect(fullThreeSixtySummary.riskAreas).toContainEqual(
        expect.objectContaining({
          riskArea: expect.objectContaining({ id: riskArea2.id }),
          scoreData: expect.objectContaining({ forceHighRisk: true, score: 0 }),
          summaryData: expect.objectContaining({
            summary: expect.arrayContaining(['really hates writing tests summary text!']),
          }),
        }),
      );
      expect(fullThreeSixtySummary.riskAreas).toContainEqual(
        expect.objectContaining({
          riskArea: expect.objectContaining({ id: riskArea.id }),
          scoreData: expect.objectContaining({ forceHighRisk: false, score: 1 }),
          summaryData: expect.objectContaining({
            summary: expect.arrayContaining(['loves writing tests summary text!']),
          }),
        }),
      );
    });
  });
});
