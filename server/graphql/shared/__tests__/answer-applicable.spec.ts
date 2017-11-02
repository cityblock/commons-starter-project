import * as uuid from 'uuid/v4';
import Db from '../../../db';
import Answer from '../../../models/answer';
import Patient from '../../../models/patient';
import PatientAnswer from '../../../models/patient-answer';
import Question from '../../../models/question';
import QuestionCondition from '../../../models/question-condition';
import RiskArea from '../../../models/risk-area';
import User from '../../../models/user';
import { createMockPatient, createPatient } from '../../../spec-helpers';
import {
  getPatientAnswersByQuestionId,
  isQuestionApplicable,
  updatePatientAnswerApplicable,
} from '../answer-applicable';

describe('answer applicable tests', () => {
  const userRole = 'admin';
  const homeClinicId = uuid();

  let db: Db;
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId });

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
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('isQuestionApplicable', () => {
    let question2: Question;
    let answer2: Answer;
    let answer3: Answer;

    beforeEach(async () => {
      question2 = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      });
      answer2 = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
      answer3 = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
    });

    it('works if no applicable question conditions', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer2.questionId,
            answerId: answer2.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });
      question.answers = [answer];
      question2.answers = [answer2, answer3];
      question.applicableIfQuestionConditions = [];
      question.applicableIfType = 'oneTrue';
      const patientAnswersByQuestionId = getPatientAnswersByQuestionId(
        [patientAnswers[0]],
        [question, question2],
      );
      expect(isQuestionApplicable(question, patientAnswersByQuestionId)).toBeTruthy();
    });

    it('works for oneTrue', async () => {
      const questionCondition = await QuestionCondition.create({
        questionId: question.id,
        answerId: answer2.id,
      });
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer2.questionId,
            answerId: answer2.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });

      question.answers = [answer];
      question2.answers = [answer2, answer3];
      question.applicableIfQuestionConditions = [questionCondition];
      question.applicableIfType = 'oneTrue';
      const patientAnswersByQuestionId = getPatientAnswersByQuestionId(
        [patientAnswers[0]],
        [question, question2],
      );
      expect(isQuestionApplicable(question, patientAnswersByQuestionId)).toBeTruthy();
    });

    it('works for allTrue', async () => {
      const questionCondition = await QuestionCondition.create({
        questionId: question.id,
        answerId: answer2.id,
      });
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer2.questionId,
            answerId: answer2.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });

      question.answers = [answer];
      question2.answers = [answer2, answer3];
      question.applicableIfQuestionConditions = [questionCondition];
      question.applicableIfType = 'allTrue';
      const patientAnswersByQuestionId = getPatientAnswersByQuestionId(
        [patientAnswers[0]],
        [question, question2],
      );
      expect(isQuestionApplicable(question, patientAnswersByQuestionId)).toBeTruthy();

      // add another condition which is not met by patient answers
      const questionCondition2 = await QuestionCondition.create({
        questionId: question.id,
        answerId: answer3.id,
      });
      question.applicableIfQuestionConditions = [questionCondition, questionCondition2];
      expect(isQuestionApplicable(question, patientAnswersByQuestionId)).toBeFalsy();
    });
  });

  describe('getPatientAnswersByQuestionId', () => {
    it('gets patient answers by question id', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });
      question.answers = [answer];
      const questionIdHash: any = {};
      questionIdHash[question.id] = [patientAnswers[0]];
      expect(getPatientAnswersByQuestionId([patientAnswers[0]], [question])).toEqual(
        questionIdHash,
      );
    });

    it('errors if patient answers do not match question', async () => {
      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });
      const otherQuestion = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      });
      const otherAnswer = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question.id,
        order: 1,
      });
      otherQuestion.answers = [otherAnswer];
      expect(() =>
        getPatientAnswersByQuestionId([patientAnswers[0]], [otherQuestion]),
      ).toThrowError('Patient answers are not answers to the questions');
    });
  });

  describe('updateQuestionApplicable', () => {
    it('works for questions going from not applicable to applicable', async () => {
      const question2 = await Question.create({
        title: 'really really like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      });
      const answer2 = await Answer.create({
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question2.id,
        order: 1,
      });
      await QuestionCondition.create({
        questionId: question.id,
        answerId: answer2.id,
      });

      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer2.questionId,
            answerId: answer2.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });
      question.answers = [answer];
      question2.answers = [answer2];
      const updatedPatientAnswers = await Promise.all(
        updatePatientAnswerApplicable([patientAnswers[0]], [question, question2]),
      );
      patientAnswers[0].applicable = true;
      expect(updatedPatientAnswers).toMatchObject([patientAnswers[0]]);
    });
  });
});
