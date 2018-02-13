import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
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

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const answer = await Answer.create(
    {
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
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
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve answer', () => {
    it('can fetch answer', async () => {
      await transaction(Answer.knex(), async txn => {
        const { answer, question, user } = await setup(txn);
        const query = `{
          answer(answerId: "${answer.id}") {
            id
            displayValue
            value
            valueType
            riskAdjustmentType
            inSummary
            summaryText
            order
            questionId
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.answer)).toMatchObject({
          id: answer.id,
          displayValue: 'loves writing tests!',
          value: '3',
          valueType: 'number',
          riskAdjustmentType: 'forceHighRisk',
          inSummary: false,
          order: 1,
          questionId: question.id,
        });
      });
    });

    it('errors if an answer cannot be found', async () => {
      await transaction(Answer.knex(), async txn => {
        const { user } = await setup(txn);
        const fakeId = uuid();
        const query = `{ answer(answerId: "${fakeId}") { id } }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(result.errors![0].message).toMatch(`No such answer: ${fakeId}`);
      });
    });
  });

  describe('resolve question answers', () => {
    it('resolves question answers', async () => {
      await transaction(Answer.knex(), async txn => {
        const { question, answer, user } = await setup(txn);
        const query = `{
          answersForQuestion(questionId: "${question.id}") {
            id, displayValue
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });

        expect(cloneDeep(result.data!.answersForQuestion)).toMatchObject([
          {
            id: answer.id,
            displayValue: answer.displayValue,
          },
        ]);
      });
    });
  });

  describe('answer edit', () => {
    it('edits answer', async () => {
      await transaction(Answer.knex(), async txn => {
        const { answer, user } = await setup(txn);
        const query = `mutation {
          answerEdit(input: { displayValue: "new display value", answerId: "${answer.id}" }) {
            displayValue
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.answerEdit)).toMatchObject({
          displayValue: 'new display value',
        });
      });
    });
  });

  describe('answer create', () => {
    it('creates a new answer', async () => {
      await transaction(Answer.knex(), async txn => {
        const { question, user } = await setup(txn);
        const mutation = `mutation {
          answerCreate(input: {
            displayValue: "loves writing tests too!"
            value: "2"
            valueType: number
            riskAdjustmentType: forceHighRisk
            inSummary: false,
            questionId: "${question.id}"
            order: 1,
          }) {
            displayValue
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.answerCreate)).toMatchObject({
          displayValue: 'loves writing tests too!',
        });
      });
    });
  });

  describe('answer delete', () => {
    it('marks an answer as deleted', async () => {
      await transaction(Answer.knex(), async txn => {
        const { answer, user } = await setup(txn);
        const mutation = `mutation {
          answerDelete(input: { answerId: "${answer.id}" }) {
            id,
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.answerDelete)).toMatchObject({
          id: answer.id,
        });
      });
    });
  });
});
