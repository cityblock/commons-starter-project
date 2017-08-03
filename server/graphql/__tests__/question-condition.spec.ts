import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Question from '../../models/question';
import QuestionCondition from '../../models/question-condition';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('questionCondition tests', () => {

  let db: Db = null as any;
  const userRole = 'admin';
  let riskArea: RiskArea = null as any;
  let question: Question = null as any;
  let answer: Answer = null as any;
  let user: User = null as any;

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
      value: '3',
      valueType: 'number',
      displayValue: 'loves writing tests!',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve questionCondition', () => {
    it('can fetch questionCondition', async () => {
      const questionCondition = await QuestionCondition.create({
        answerId: answer.id, questionId: question.id,
      });
      const query = `{
        questionCondition(questionConditionId: "${questionCondition.id}") {
          id
          questionId
          answerId
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.questionCondition)).toMatchObject({
        id: questionCondition.id,
        questionId: question.id,
        answerId: answer.id,
      });
    });

    it('errors if an questionCondition cannot be found', async () => {
      const query = `{ questionCondition(questionConditionId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'No such questionCondition: fakeId',
      );
    });
  });

  describe('questionCondition edit', () => {
    it('edits questionCondition with invalid q/a pair should error', async () => {
      const questionCondition = await QuestionCondition.create({
        answerId: answer.id, questionId: question.id,
      });
      const question2 = await Question.create({
        title: 'like writing tests?',
        answerType: 'dropdown',
        riskAreaId: riskArea.id,
        order: 1,
      });
      const query = `mutation {
        questionConditionEdit(input: {
          answerId: "${answer.id}"
          questionId: "${question2.id}"
          questionConditionId: "${questionCondition.id}"
         }) {
          id
          questionId
          answerId
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(
        cloneDeep(result.errors![0]),
      ).toMatchObject(
        new Error(`Question ${question2.id} is not associated with answer ${answer.id}`),
      );
    });

    it('edits questionCondition', async () => {
      const questionCondition = await QuestionCondition.create({
        answerId: answer.id, questionId: question.id,
      });
      const answer2 = await Answer.create({
        value: '2',
        valueType: 'number',
        displayValue: 'meh writing tests!',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question.id,
        order: 2,
      });
      const query = `mutation {
        questionConditionEdit(input: {
          answerId: "${answer2.id}"
          questionId: "${question.id}"
          questionConditionId: "${questionCondition.id}"
         }) {
          id
          questionId
          answerId
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questionConditionEdit)).toMatchObject({
        id: questionCondition.id,
        questionId: question.id,
        answerId: answer2.id,
      });
    });
  });

  describe('questionCondition create', () => {
    it('creates a new questionCondition', async () => {
      const mutation = `mutation {
        questionConditionCreate(input: {
          questionId: "${question.id}"
          answerId: "${answer.id}"
        }) {
          id
          questionId
          answerId
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questionConditionCreate)).toMatchObject({
        questionId: question.id,
        answerId: answer.id,
      });
    });

  });

  describe('questionCondition delete', () => {
    it('marks an questionCondition as deleted', async () => {
      const questionCondition = await QuestionCondition.create({
        answerId: answer.id, questionId: question.id,
      });
      const mutation = `mutation {
        questionConditionDelete(input: { questionConditionId: "${questionCondition.id}" }) {
          id
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.questionConditionDelete)).toMatchObject({
        id: questionCondition.id,
      });
    });
  });
});
