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
import { createMockPatient, createPatient } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient answer tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let question: Question;
  let answer: Answer;
  let answer2: Answer;
  let user: User;
  let patient: Patient;

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;

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
    answer2 = await Answer.create({
      displayValue: 'hates writing tests!',
      value: '4',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });
    patient = await createPatient(createMockPatient(123), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve patient answer', () => {
    it('can fetch patient answer', async () => {
      const patientAnswers = await PatientAnswer.create({
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
      const query = `{
        patientAnswer(patientAnswerId: "${patientAnswers[0].id}") {
          id
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswer)).toMatchObject({
        id: patientAnswers[0].id,
        answerId: answer.id,
        answerValue: '3',
        patientId: patient.id,
        applicable: true,
      });
    });

    it('errors if a patient answer cannot be found', async () => {
      const query = `{ patientAnswer(patientAnswerId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch('No such patientAnswer: fakeId');
    });
  });

  describe('resolve patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswers = await PatientAnswer.create({
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
      const query = `{
        patientAnswersForQuestion(questionId: "${question.id}", patientId: "${patient.id}") {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientAnswersForQuestion)).toMatchObject([
        {
          id: patientAnswers[0].id,
          answerValue: patientAnswers[0].answerValue,
        },
      ]);
    });
  });

  describe('resolve previous patient answer for question', () => {
    it('resolves patient answer for question', async () => {
      const patientAnswers = await PatientAnswer.create({
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
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '2',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });
      const query = `{
        patientPreviousAnswersForQuestion(
          questionId: "${question.id}", patientId: "${patient.id}"
        ) {
          id, answerValue
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });

      expect(cloneDeep(result.data!.patientPreviousAnswersForQuestion)).toMatchObject([
        {
          id: patientAnswers[0].id,
          answerValue: '3',
        },
      ]);
    });
  });

  describe('resolve patient answers for risk area', () => {
    it('resolves patient answers for a risk area', async () => {
      const riskArea2 = await RiskArea.create({
        title: 'testing2',
        order: 2,
      });
      const differentQuestion = await Question.create({
        title: 'like writing tests again?',
        answerType: 'dropdown',
        riskAreaId: riskArea2.id,
        order: 1,
      });
      const differentAnswer = await Answer.create({
        displayValue: 'loves writing more tests!',
        value: '3',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: differentQuestion.id,
        order: 1,
      });
      const patientAnswers1 = await PatientAnswer.create({
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
      const patientAnswers2 = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: differentAnswer.questionId,
            answerId: differentAnswer.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true,
            userId: user.id,
          },
        ],
      });

      const query = `{
        patientAnswersForRiskArea(
          riskAreaId: "${riskArea.id}", patientId: "${patient.id}"
        ) {
          id
          answerValue
          question {
            id
          }
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const answers = cloneDeep(result.data!.patientAnswersForRiskArea);

      expect(answers).toMatchObject([
        {
          id: patientAnswers1[0].id,
          answerValue: '3',
          question: {
            id: question.id,
          },
        },
      ]);

      expect(answers.map((ans: any) => ans.id)).not.toContain(patientAnswers2[0].id);
    });
  });

  describe('answer edit', () => {
    it('edits answer', async () => {
      const patientAnswers = await PatientAnswer.create({
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
      const query = `mutation {
        patientAnswerEdit(input: {
          applicable: false,
          patientAnswerId: "${patientAnswers[0].id}",
        }) {
          applicable
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswerEdit)).toMatchObject({
        applicable: false,
      });
    });
  });

  describe('patient answers create', () => {
    it('creates a new patient answer', async () => {
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}"],
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "loves writing tests too!"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswersCreate[0])).toMatchObject({
        answerValue: 'loves writing tests too!',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });
    });

    it('creates multiple new patient answers', async () => {
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}", "${answer2.questionId}"],
          patientAnswers: [{
            questionId: "${answer.questionId}"
            answerValue: "loves writing tests too!"
            answerId: "${answer.id}",
            patientId: "${patient.id}",
            applicable: false,
          }, {
            questionId: "${answer2.questionId}"
            answerValue: "hates writing tests too!"
            answerId: "${answer2.id}",
            patientId: "${patient.id}",
            applicable: false,
          }]
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const clonedResult = cloneDeep(result.data!.patientAnswersCreate);
      expect(clonedResult[0]).toMatchObject({
        answerValue: 'loves writing tests too!',
        answerId: answer.id,
        patientId: patient.id,
        applicable: false,
      });
      expect(clonedResult[1]).toMatchObject({
        answerValue: 'hates writing tests too!',
        answerId: answer2.id,
        patientId: patient.id,
        applicable: false,
      });
    });

    it('properly marks previous answers as deleted when only questionIds are given', async () => {
      const createdAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer.questionId,
            answerId: answer.id,
            answerValue: '1',
            userId: user.id,
            patientId: patient.id,
            applicable: true,
          },
        ],
      });
      const fetchedAnswers1 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
      expect(fetchedAnswers1!.map(ans => ans.id)).toContain(createdAnswers[0].id);

      // Running this mutation should mark previous answer as deleted
      const mutation = `mutation {
        patientAnswersCreate(input: {
          patientId: "${patient.id}",
          questionIds: ["${answer.questionId}"],
          patientAnswers: []
        }) {
          answerId,
          answerValue,
          patientId,
          applicable,
        }
      }`;
      await graphql(schema, mutation, null, { db, userRole, userId: user.id });

      const fetchedAnswers2 = await PatientAnswer.getForQuestion(answer.questionId, patient.id);
      expect(fetchedAnswers2!.map(ans => ans.id)).not.toContain(createdAnswers[0].id);
    });
  });

  describe('patient answer delete', () => {
    it('marks a patient answer as deleted', async () => {
      const patientAnswers = await PatientAnswer.create({
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
      const mutation = `mutation {
        patientAnswerDelete(input: { patientAnswerId: "${patientAnswers[0].id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswerDelete)).toMatchObject({
        id: patientAnswers[0].id,
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
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientAnswersUpdateApplicable)).toMatchObject([]);
    });

    it('works for questions going from not applicable to applicable', async () => {
      const question2 = await Question.create({
        title: 'really really like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const answer3 = await Answer.create({
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
        answerId: answer3.id,
      });

      const patientAnswers = await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer3.questionId,
            answerId: answer3.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: false,
            userId: user.id,
          },
        ],
      });

      const mutation = `mutation {
        patientAnswersUpdateApplicable(
          input: { patientId: "${patient.id}", riskAreaId: "${riskArea.id}" }
        ) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.patientAnswersUpdateApplicable)).toMatchObject([
        { id: patientAnswers[0].id },
      ]);
    });

    it('works for answers if nothing changes', async () => {
      const question2 = await Question.create({
        title: 'really really like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const answer3 = await Answer.create({
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
        answerId: answer3.id,
      });

      await PatientAnswer.create({
        patientId: patient.id,
        answers: [
          {
            questionId: answer3.questionId,
            answerId: answer3.id,
            answerValue: '3',
            patientId: patient.id,
            applicable: true, // << important part
            userId: user.id,
          },
        ],
      });

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
  });
});
