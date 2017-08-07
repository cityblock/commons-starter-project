import Db from '../../db';
import {
  createMockPatient,
  createPatient,
} from '../../spec-helpers';
import Answer from '../answer';
import Patient from '../patient';
import PatientAnswer from '../patient-answer';
import Question from '../question';
import RiskArea from '../risk-area';
import User from '../user';

const userRole = 'physician';

describe('anser model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let patient: Patient;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

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
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    user = await User.create({
      email: 'care@care.com',
      userRole,
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should creates and get an answer', async () => {
    const patientAnswer = await PatientAnswer.create({
      answerId: answer.id,
      answerValue: '3',
      patientId: patient.id,
      applicable: true,
    });
    expect(patientAnswer.answerValue).toEqual('3');
    expect(await PatientAnswer.get(patientAnswer.id)).toEqual(patientAnswer);
    expect(await PatientAnswer.getForQuestion(question.id)).toEqual(patientAnswer);
  });

  it('should throw an error if an answer does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(PatientAnswer.get(fakeId))
      .rejects
      .toMatch('No such patientAnswer: fakeId');
  });

  it('can get answer history', async () => {
    const patientAnswer = await PatientAnswer.create({
      answerId: answer.id,
      answerValue: '3',
      patientId: patient.id,
      applicable: true,
    });
    expect(patientAnswer.answerValue).toEqual('3');
    const patientAnswer2 = await PatientAnswer.create({
      answerId: answer.id,
      answerValue: '2',
      patientId: patient.id,
      applicable: true,
    });
    expect(patientAnswer2.answerValue).toEqual('2');

    const updatedOldAnswer = await PatientAnswer.get(patientAnswer.id);

    expect(await PatientAnswer.getPreviousAnswersForQuestion(question.id))
      .toEqual([updatedOldAnswer]);
  });

  it('edits patient answer applicable', async () => {
    const patientAnswer = await PatientAnswer.create({
      answerId: answer.id,
      answerValue: '3',
      patientId: patient.id,
      applicable: true,
    });
    const patientAnswerUpdated = await PatientAnswer.editApplicable(false, patientAnswer.id);
    expect(patientAnswerUpdated.applicable).toBeFalsy();
  });

  it('deletes patient answer', async () => {
    const patientAnswer = await PatientAnswer.create({
      answerId: answer.id,
      answerValue: '3',
      patientId: patient.id,
      applicable: true,
    });
    const deletedPatientAnswer = await PatientAnswer.delete(patientAnswer.id);
    expect(deletedPatientAnswer).not.toBeNull();
  });
});
