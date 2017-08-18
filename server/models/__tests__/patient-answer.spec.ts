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

describe('answer model', () => {
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

  it('should create and get an answer', async () => {
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    expect(patientAnswers[0].answerValue).toEqual('3');
    expect(await PatientAnswer.get(patientAnswers[0].id)).toEqual(patientAnswers[0]);
    expect(await PatientAnswer.getForQuestion(
      question.id, patient.id,
    )).toMatchObject([patientAnswers[0]]);
  });

  it('should mark appropriate previous answers as deleted', async () => {
    const previousAnswers = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    const fetchedAnswers1 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
    expect(fetchedAnswers1!.map(ans => ans.id)).toContain(previousAnswers[0].id);

    const differentAnswer = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });

    const newAnswers = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: differentAnswer.id,
        answerValue: '4',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    const fetchedAnswers2 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
    const fetchedAnswers2Ids = fetchedAnswers2!.map(ans => ans.id);

    expect(fetchedAnswers2Ids).toContain(newAnswers[0].id);
    expect(fetchedAnswers2Ids).not.toContain(previousAnswers[0].id);
  });

  it('getForQuestion returns most recent answer for non-multiselect question', async () => {
    await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '2',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    expect(patientAnswers[0].answerValue).toEqual('2');
    expect(await PatientAnswer.getForQuestion(
      question.id, patient.id,
    )).toEqual([patientAnswers[0]]);
  });

  it('should create and get an answer for multiselect', async () => {
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'multiselect',
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
    const patientAnswers = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    const patientAnswers2 = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '2',
        patientId: patient.id,
        userId: user.id,
        applicable: true,
      }],
    });
    expect(patientAnswers[0].answerValue).toEqual('3');
    expect((await PatientAnswer.get(patientAnswers[0].id))!.id).toEqual(patientAnswers[0].id);
    expect(
      (await PatientAnswer.getForQuestion(question.id, patient.id))!.map(ans => ans.id),
    ).toEqual([patientAnswers2[0].id]); // Only checking for answer2, since it will replace answer1
  });

  it('should throw an error if an answer does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(PatientAnswer.get(fakeId))
      .rejects
      .toMatch('No such patientAnswer: fakeId');
  });

  it('gets all patient answers for a given patient', async () => {
    const patientAnswers = await PatientAnswer.create({
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

    const fetchedAnswers = await PatientAnswer.getAllForPatient(patient.id);

    expect(fetchedAnswers[0].id).toEqual(patientAnswers[0].id);
  });

  it('can get answer history', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    expect(patientAnswers[0].answerValue).toEqual('3');
    const patientAnswers2 = await PatientAnswer.create({
      patientId: patient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '2',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      }],
    });
    expect(patientAnswers2[0].answerValue).toEqual('2');

    // should not include answers for another patient
    const otherPatient = await createPatient(createMockPatient(321), user.id);
    await PatientAnswer.create({
      patientId: otherPatient.id,
      answers: [{
        questionId: answer.questionId,
        answerId: answer.id,
        answerValue: '2',
        patientId: otherPatient.id,
        applicable: true,
        userId: user.id,
      }],
    });

    const updatedOldAnswer = await PatientAnswer.get(patientAnswers[0].id);

    expect(await PatientAnswer.getPreviousAnswersForQuestion(question.id, patient.id))
      .toEqual([updatedOldAnswer]);
  });

  it('edits patient answer applicable', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    const patientAnswerUpdated = await PatientAnswer.editApplicable(false, patientAnswers[0].id);
    expect(patientAnswerUpdated.applicable).toBeFalsy();
  });

  it('deletes patient answer', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    const deletedPatientAnswer = await PatientAnswer.delete(patientAnswers[0].id);
    expect(deletedPatientAnswer).not.toBeNull();
  });

  it('get all for risk area', async () => {
    const patientAnswers = await PatientAnswer.create({
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
    expect(await PatientAnswer.getForRiskArea(riskArea.id, patient.id))
      .toEqual([patientAnswers[0]]);
  });
});
