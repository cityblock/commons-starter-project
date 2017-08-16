import Db from '../../db';
import Answer from '../../models/answer';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import {
  createMockPatient,
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
    const fakeId = 'fakeId';
    await expect(RiskArea.get(fakeId))
      .rejects
      .toMatch('No such risk area: fakeId');
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
    expect(riskArea.deletedAt).toBeNull();
    const deleted = await RiskArea.delete(riskArea.id);
    expect(deleted.deletedAt).not.toBeNull();

    expect(await RiskArea.getAll())
      .toMatchObject([riskArea2]);
  });

  it('deleted risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.deletedAt).toBeNull();
    const deleted = await RiskArea.delete(riskArea.id);
    expect(deleted.deletedAt).not.toBeNull();
  });

  describe('questions with patient answers', () => {

    let question: Question;
    let patient: Patient;
    let riskArea: RiskArea;
    let user: User;

    beforeEach(async () => {
      riskArea = await RiskArea.create({
        title: 'testing',
        order: 1,
      });
      question = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      user = await User.create({ email: 'a@b.com', userRole: 'admin', homeClinicId: '1' });
      patient = await createPatient(createMockPatient(123), user.id);
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
        answers: [{
          questionId: answer.questionId,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }],
      });
      expect(await RiskArea.getSummaryForPatient(riskArea.id, patient.id)).toEqual([
        'summary text!',
      ]);
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
        answers: [{
          questionId: answer.questionId,
          answerId: answer.id,
          answerValue: '3',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }],
      });
      await PatientAnswer.create({
        patientId: patient.id,
        answers: [{
          questionId: highRiskAnswer.questionId,
          answerId: highRiskAnswer.id,
          answerValue: '4',
          patientId: patient.id,
          applicable: true,
          userId: user.id,
        }],
      });
      expect(await RiskArea.getRiskScoreForPatient(riskArea.id, patient.id)).toEqual({
        score: 1,
        forceHighRisk: true,
      });
    });
  });
});
