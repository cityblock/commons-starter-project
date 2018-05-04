import { transaction, Transaction } from 'objection';
import { AnswerTypeOptions, AnswerValueTypeOptions, RiskAdjustmentTypeOptions } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import Question from '../question';
import QuestionCondition from '../question-condition';
import RiskArea from '../risk-area';

interface ISetup {
  riskArea: RiskArea;
  question: Question;
  question2: Question;
  answer: Answer;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    txn,
  );
  const question2 = await Question.create(
    {
      title: 'really like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 2,
    },
    txn,
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
    txn,
  );

  return {
    riskArea,
    question,
    question2,
    answer,
  };
}

describe('question condition model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets questionCondition', async () => {
    const { answer, question2 } = await setup(txn);
    const questionCondition = await QuestionCondition.create(
      {
        answerId: answer.id,
        questionId: question2.id,
      },
      txn,
    );
    expect(questionCondition).toMatchObject({
      answerId: answer.id,
      questionId: question2.id,
    });
    const queriedQuestionCondition = await QuestionCondition.get(questionCondition.id, txn);
    expect(queriedQuestionCondition).toMatchObject({
      answerId: answer.id,
      questionId: question2.id,
    });
  });

  it('should throw an error if a patient does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(QuestionCondition.get(fakeId, txn)).rejects.toMatch(
      `No such questionCondition: ${fakeId}`,
    );
  });

  it('cannot create questionCondition for answer that is on question', async () => {
    const { answer, question } = await setup(txn);
    await expect(
      QuestionCondition.create({ answerId: answer.id, questionId: question.id }, txn),
    ).rejects.toMatch(`Error: Answer ${answer.id} is an answer to question ${question.id}`);
  });

  it('edits questionCondition for answer', async () => {
    const { question, answer, question2 } = await setup(txn);
    const answer2 = await Answer.create(
      {
        displayValue: 'meh about writing tests!',
        value: '3',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 1,
      },
      txn,
    );
    const questionCondition = await QuestionCondition.create(
      {
        answerId: answer.id,
        questionId: question2.id,
      },
      txn,
    );
    expect(
      await QuestionCondition.edit(
        { answerId: answer2.id, questionId: question2.id },
        questionCondition.id,
        txn,
      ),
    ).toMatchObject({
      answerId: answer2.id,
      questionId: question2.id,
    });
  });

  it('deletes questionCondition', async () => {
    const { answer, question2 } = await setup(txn);
    const questionCondition = await QuestionCondition.create(
      {
        answerId: answer.id,
        questionId: question2.id,
      },
      txn,
    );
    expect(questionCondition.deletedAt).toBeFalsy();
    const deleted = await QuestionCondition.delete(questionCondition.id, txn);
    expect(deleted.deletedAt).not.toBeFalsy();
  });
});
