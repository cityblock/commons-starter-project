import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import * as uuid from 'uuid/v4';
import * as answerCreate from '../../../app/graphql/queries/answer-create-mutation.graphql';
import * as answerDelete from '../../../app/graphql/queries/answer-delete-mutation.graphql';
import * as answerEdit from '../../../app/graphql/queries/answer-edit-mutation.graphql';
import * as getAnswer from '../../../app/graphql/queries/get-answer.graphql';
import * as getAnswersForQuestion from '../../../app/graphql/queries/get-question-answers.graphql';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  riskArea: RiskArea;
  question: Question;
  answer: Answer;
  user: User;
  clinic: Clinic;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), trx);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, trx);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    trx,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    trx,
  );

  return {
    clinic,
    user,
    riskArea,
    question,
    answer,
  };
}

describe('answer tests', () => {
  let txn = null as any;

  const answerCreateMutation = print(answerCreate);
  const answerEditMutation = print(answerEdit);
  const answerDeleteMutation = print(answerDelete);
  const getAnswerQuery = print(getAnswer);
  const getAnswersForQuestionQuery = print(getAnswersForQuestion);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve answer', () => {
    it('can fetch answer', async () => {
      const { answer, question, user } = await setup(txn);

      const result = await graphql(
        schema,
        getAnswerQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { answerId: answer.id },
      );
      expect(cloneDeep(result.data!.answer)).toMatchObject({
        id: answer.id,
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        order: 1,
        questionId: question.id,
      });
    });

    it('errors if an answer cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const result = await graphql(
        schema,
        getAnswerQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { answerId: fakeId },
      );
      expect(result.errors![0].message).toMatch(`No such answer: ${fakeId}`);
    });
  });

  describe('resolve question answers', () => {
    it('resolves question answers', async () => {
      const { question, answer, user } = await setup(txn);
      const result = await graphql(
        schema,
        getAnswersForQuestionQuery,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { questionId: question.id },
      );

      expect(cloneDeep(result.data!.answersForQuestion)).toMatchObject([
        {
          id: answer.id,
          displayValue: answer.displayValue,
        },
      ]);
    });
  });

  describe('answer edit', () => {
    it('edits answer', async () => {
      const { answer, user } = await setup(txn);
      const result = await graphql(
        schema,
        answerEditMutation,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { displayValue: 'new display value', answerId: answer.id },
      );
      expect(cloneDeep(result.data!.answerEdit)).toMatchObject({
        displayValue: 'new display value',
      });
    });
  });

  describe('answer create', () => {
    it('creates a new answer', async () => {
      const { question, user } = await setup(txn);
      const result = await graphql(
        schema,
        answerCreateMutation,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        {
          displayValue: 'loves writing tests too!',
          value: '2',
          valueType: 'number' as AnswerValueTypeOptions,
          riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
          inSummary: false,
          questionId: question.id,
          order: 1,
        },
      );
      expect(cloneDeep(result.data!.answerCreate)).toMatchObject({
        displayValue: 'loves writing tests too!',
      });
    });
  });

  describe('answer delete', () => {
    it('marks an answer as deleted', async () => {
      const { answer, user } = await setup(txn);
      const result = await graphql(
        schema,
        answerDeleteMutation,
        null,
        {
          permissions,
          userId: user.id,
          txn,
        },
        { answerId: answer.id },
      );
      expect(cloneDeep(result.data!.answerDelete)).toMatchObject({
        id: answer.id,
      });
    });
  });
});
