import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Patient from '../../models/patient';
import PatientAnswer from '../../models/patient-answer';
import Question from '../../models/question';
import QuestionCondition from '../../models/question-condition';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient answer tests', () => {

  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });

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
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient answer', () => {
    it('can fetch patient answer', async () => {
      const patientAnswer = await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      });
      const query = `{
        patientAnswer(patientAnswerId: "${patientAnswer.id}") {
          id
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswer)).toMatchObject({
        id: patientAnswer.id,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
      });
    });

    it('errors if a patient answer cannot be found', async () => {
      const query = `{ patientAnswer(patientAnswerId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'No such patientAnswer: fakeId',
      );
    });
  });

  describe('resolve patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswer = await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      });
      const query = `{
        patientAnswersForQuestion(questionId: "${question.id}", patientId: "${patient.id}") {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswersForQuestion)).toMatchObject([{
        id: patientAnswer.id,
        answerValue: patientAnswer.answerValue,
      }]);
    });
  });

  describe('resolve previous patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswer = await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      });

      await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '2',
        patientId: patient.id,
        applicable: true,
        userId: user.id,

      });
      const query = `{
        patientPreviousAnswersForQuestion(
          questionId: "${question.id}", patientId: "${patient.id}"
        ) {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.data!.patientPreviousAnswersForQuestion)).toMatchObject([{
        id: patientAnswer.id,
        answerValue: '3',
      }]);
    });
  });

  describe('answer edit', () => {
    it('edits answer', async () => {
      const patientAnswer = await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      });
      const query = `mutation {
        patientAnswerEdit(input: { applicable: false, patientAnswerId: "${patientAnswer.id}" }) {
          applicable
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientAnswerEdit)).toMatchObject({
        applicable: false,
      });
    });
  });

  describe('patient answer create', () => {
    it('creates a new patient answer', async () => {
      const mutation = `mutation {
        patientAnswerCreate(input: {
          answerValue: "loves writing tests too!"
          answerId: "${answer.id}",
          patientId: "${patient.id}",
          applicable: false,
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientAnswerCreate)).toMatchObject({
        answerValue: 'loves writing tests too!',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });
    });

  });

  describe('patient answer delete', () => {
    it('marks a patient answer as deleted', async () => {
      const patientAnswer = await PatientAnswer.create({
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
        userId: user.id,
      });
      const mutation = `mutation {
        patientAnswerDelete(input: { patientAnswerId: "${patientAnswer.id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientAnswerDelete)).toMatchObject({
        id: patientAnswer.id,
      });
    });
  });

  describe('update applicable for patient answers', () => {
    it('works with no patient answers', async () => {
      const mutation = `mutation {
        patientAnswersUpdateApplicable(
          input: { patientId: "${patient.id}", riskAreaId: "${riskArea.id}" }
        ) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientAnswersUpdateApplicable)).toMatchObject([]);
    });

    it('works for questions going from not applicable to applicable', async () => {
      const question2 = await Question.create({
        title: 'really really like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
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

      const patientAnswer = await PatientAnswer.create({
        answerId: answer2.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: false,
        userId: user.id,
      });

      const mutation = `mutation {
        patientAnswersUpdateApplicable(
          input: { patientId: "${patient.id}", riskAreaId: "${riskArea.id}" }
        ) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(
        cloneDeep(result.data!.patientAnswersUpdateApplicable),
      ).toMatchObject([{ id: patientAnswer.id }]);
    });

    it('works for answers if nothing changes', async () => {
      const question2 = await Question.create({
        title: 'really really like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
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

      await PatientAnswer.create({
        answerId: answer2.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true, // << important part
        userId: user.id,
      });

      const mutation = `mutation {
        patientAnswersUpdateApplicable(
          input: { patientId: "${patient.id}", riskAreaId: "${riskArea.id}" }
        ) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(
        cloneDeep(result.data!.patientAnswersUpdateApplicable),
      ).toMatchObject([]);
    });
  });
});
