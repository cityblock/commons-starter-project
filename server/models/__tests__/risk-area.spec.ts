import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';

describe('risk area model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should creates and get a risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.title).toEqual('Housing');
    expect(await RiskArea.get(riskArea.id)).toEqual(riskArea);
  });

  it('should throw an error if a risk area does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(RiskArea.get(fakeId)).rejects.toMatch(`No such risk area: ${fakeId}`);
  });

  it('edits risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.title).toEqual('Housing');
    const editedRiskArea = await RiskArea.edit({ title: 'Mental Health' }, riskArea.id);
    expect(editedRiskArea.title).toEqual('Mental Health');
  });

  it('get all risk areas', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    const riskArea2 = await RiskArea.create({
      title: 'Housing 2',
      order: 2,
    });
    expect(riskArea.deletedAt).toBeFalsy();
    const deleted = await RiskArea.delete(riskArea.id);
    expect(deleted.deletedAt).not.toBeFalsy();

    expect(await RiskArea.getAll()).toMatchObject([riskArea2]);
  });

  it('deleted risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.deletedAt).toBeFalsy();
    const deleted = await RiskArea.delete(riskArea.id);
    expect(deleted.deletedAt).not.toBeFalsy();
  });

  describe('questions with patient answers', () => {
    let question: Question;
    let patient: Patient;
    let riskArea: RiskArea;
    let user: User;
    let clinic: Clinic;

    beforeEach(async () => {
      riskArea = await RiskArea.create({
        title: 'testing',
        order: 1,
      });
      question = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      });
      clinic = await Clinic.create(createMockClinic());
      user = await User.create(createMockUser(11, clinic.id));
      patient = await createPatient(createMockPatient(123, clinic.id), user.id);
    });

    it('gets summary for patient', async () => {
      const answer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question.id,
        order: 1,
      });
      await PatientAnswer.create({
        patientId: patient.id,
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
      });
      expect(await RiskArea.getSummaryForPatient(riskArea.id, patient.id)).toMatchObject({
        started: true,
        summary: ['summary text!'],
      });
    });

    it('gets increment and high risk score for patient', async () => {
      const answer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'increment',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question.id,
        order: 1,
      });
      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 2,
      });
      const highRiskAnswer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '4',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'summary text!',
        questionId: question2.id,
        order: 1,
      });
      await PatientAnswer.create({
        patientId: patient.id,
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
      });
      await PatientAnswer.create({
        patientId: patient.id,
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
      });
      expect(await RiskArea.getRiskScoreForPatient(riskArea.id, patient.id)).toEqual({
        score: 1,
        forceHighRisk: true,
      });
    });

    it('gets a full 360 degree summary for a patient', async () => {
      const riskArea2 = await RiskArea.create({
        title: 'risk area 2',
        order: 2,
      });
      const question2 = await Question.create({
        title: 'hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 2,
      });
      const question3 = await Question.create({
        title: 'really hate writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea2.id,
        type: 'riskArea',
        order: 1,
      });
      const answer1 = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'increment',
        inSummary: true,
        summaryText: 'loves writing tests summary text!',
        questionId: question.id,
        order: 1,
      });
      const answer2 = await Answer.create({
        displayValue: 'hates writing tests!',
        value: '4',
        valueType: 'number',
        riskAdjustmentType: 'increment',
        inSummary: true,
        summaryText: 'hates writing tests summary text!',
        questionId: question2.id,
        order: 1,
      });
      const answer3 = await Answer.create({
        displayValue: 'really hates writing tests!',
        value: '5',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: true,
        summaryText: 'really hates writing tests summary text!',
        questionId: question3.id,
        order: 1,
      });
      await PatientAnswer.create({
        patientId: patient.id,
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
      });

      const fullThreeSixtySummary = await RiskArea.getThreeSixtySummaryForPatient(patient.id);
      expect(fullThreeSixtySummary.riskAreas.length).toEqual(2);
      expect(fullThreeSixtySummary.riskAreas[0].riskArea.id).toEqual(riskArea.id);
      expect(fullThreeSixtySummary.riskAreas[1].riskArea.id).toEqual(riskArea2.id);
      expect(fullThreeSixtySummary.riskAreas[0].scoreData.forceHighRisk).toEqual(false);
      expect(fullThreeSixtySummary.riskAreas[0].scoreData.score).toEqual(1);
      expect(fullThreeSixtySummary.riskAreas[0].summaryData.summary).toContain(
        'loves writing tests summary text!',
      );
      expect(fullThreeSixtySummary.riskAreas[0].summaryData.summary).not.toContain(
        'hates writing tests summary text!',
      );
      expect(fullThreeSixtySummary.riskAreas[1].scoreData.forceHighRisk).toEqual(true);
      expect(fullThreeSixtySummary.riskAreas[1].summaryData.summary).toContain(
        'really hates writing tests summary text!',
      );
    });
  });
});
