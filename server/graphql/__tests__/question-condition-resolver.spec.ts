import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import * as uuid from 'uuid/v4';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Question from '../../models/question';
import QuestionCondition from '../../models/question-condition';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  question: Question;
  question2: Question;
  answer: Answer;
  user: User;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);

  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 1,
    },
    txn,
  );
  const question2 = await Question.create(
    {
      title: 'really like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      type: 'riskArea',
      riskAreaId: riskArea.id,
      order: 2,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      displayValue: 'loves writing tests!',
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );

  return {
    question,
    question2,
    answer,
    user,
  };
}

describe('questionCondition tests', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve questionCondition', () => {
    it('can fetch questionCondition', async () => {
      const { answer, question2, user } = await setup(txn);
      const questionCondition = await QuestionCondition.create(
        {
          answerId: answer.id,
          questionId: question2.id,
        },
        txn,
      );
      const query = `{
          questionCondition(questionConditionId: "${questionCondition.id}") {
            id
            questionId
            answerId
          }
        }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.questionCondition)).toMatchObject({
        id: questionCondition.id,
        questionId: question2.id,
        answerId: answer.id,
      });
    });

    it('errors if an questionCondition cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{ questionCondition(questionConditionId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(result.errors![0].message).toMatch(`No such questionCondition: ${fakeId}`);
    });
  });

  describe('questionCondition edit', () => {
    it('edits questionCondition with invalid q/a pair should error', async () => {
      const { user, answer, question, question2 } = await setup(txn);
      const questionCondition = await QuestionCondition.create(
        {
          answerId: answer.id,
          questionId: question2.id,
        },
        txn,
      );

      const query = `mutation {
          questionConditionEdit(input: {
            answerId: "${answer.id}"
            questionId: "${question.id}"
            questionConditionId: "${questionCondition.id}"
          }) {
            id
            questionId
            answerId
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.errors![0])).toMatchObject(
        new Error(`Error: Answer ${answer.id} is an answer to question ${question.id}`),
      );
    });

    it('edits questionCondition', async () => {
      const { user, answer, question, question2 } = await setup(txn);
      const questionCondition = await QuestionCondition.create(
        {
          answerId: answer.id,
          questionId: question2.id,
        },
        txn,
      );
      const answer2 = await Answer.create(
        {
          value: '2',
          valueType: 'number' as AnswerValueTypeOptions,
          displayValue: 'meh writing tests!',
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: question.id,
          order: 2,
        },
        txn,
      );
      const query = `mutation {
          questionConditionEdit(input: {
            answerId: "${answer2.id}"
            questionId: "${question2.id}"
            questionConditionId: "${questionCondition.id}"
          }) {
            id
            questionId
            answerId
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.questionConditionEdit)).toMatchObject({
        id: questionCondition.id,
        questionId: question2.id,
        answerId: answer2.id,
      });
    });
  });

  describe('questionCondition create', () => {
    it('creates a new questionCondition', async () => {
      const { user, answer, question2 } = await setup(txn);
      const mutation = `mutation {
          questionConditionCreate(input: {
            questionId: "${question2.id}"
            answerId: "${answer.id}"
          }) {
            id
            questionId
            answerId
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.questionConditionCreate)).toMatchObject({
        questionId: question2.id,
        answerId: answer.id,
      });
    });
  });

  describe('questionCondition delete', () => {
    it('marks an questionCondition as deleted', async () => {
      const { user, answer, question2 } = await setup(txn);
      const questionCondition = await QuestionCondition.create(
        {
          answerId: answer.id,
          questionId: question2.id,
        },
        txn,
      );
      const mutation = `mutation {
          questionConditionDelete(input: { questionConditionId: "${questionCondition.id}" }) {
            id
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.questionConditionDelete)).toMatchObject({
        id: questionCondition.id,
      });
    });
  });
});
