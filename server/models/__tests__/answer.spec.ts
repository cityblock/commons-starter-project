import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  ComputedFieldDataTypes,
  RiskAdjustmentTypeOptions,
} from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import ComputedField from '../computed-field';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Question from '../question';
import RiskArea from '../risk-area';

interface ISetup {
  riskArea: RiskArea;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  return { riskArea };
}

describe('answer model', () => {
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

  it('should create and get an answer', async () => {
    const { riskArea } = await setup(txn);
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
    expect(answer.displayValue).toEqual('loves writing tests!');
    expect(await Answer.get(answer.id, txn)).toEqual(answer);
  });

  it('should handle relations', async () => {
    const { riskArea } = await setup(txn);
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
    const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );
    const deleteedGoalSuggestionTemplate = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );
    const goalSuggestionTemplateWithDeletedSuggestion = await GoalSuggestionTemplate.create(
      {
        title: 'Fix housing',
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      },
      txn,
    );
    // deleted suggestion
    await GoalSuggestion.create(
      {
        goalSuggestionTemplateId: goalSuggestionTemplateWithDeletedSuggestion.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestion.delete(
      {
        goalSuggestionTemplateId: goalSuggestionTemplateWithDeletedSuggestion.id,
        answerId: answer.id,
      },
      txn,
    );
    await GoalSuggestionTemplate.delete(deleteedGoalSuggestionTemplate.id, txn);

    const receivedAnswer = await Answer.get(answer.id, txn);
    expect(receivedAnswer.goalSuggestions).toEqual([goalSuggestionTemplate]);
  });

  it('should get multiple answers', async () => {
    const { riskArea } = await setup(txn);

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
        title: 'hate writing tests?',
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
    const answer2 = await Answer.create(
      {
        displayValue: 'hate writing tests!',
        value: '2',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question2.id,
        order: 1,
      },
      txn,
    );
    const fetchedAnswers = await Answer.getMultiple([answer.id, answer2.id], txn);
    const fetchedAnswerIds = fetchedAnswers.map(ans => ans.id);
    expect(fetchedAnswerIds.length).toEqual(2);
    expect(fetchedAnswerIds).toContain(answer.id);
    expect(fetchedAnswerIds).toContain(answer2.id);
  });

  it('sets default riskAdjustmentType to inactive', async () => {
    const { riskArea } = await setup(txn);
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
    const answer = await Answer.create(
      {
        displayValue: 'loves writing tests!',
        value: '3',
        valueType: 'number' as AnswerValueTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 1,
      },
      txn,
    );
    expect(answer.riskAdjustmentType).toEqual('inactive');
  });

  it('should throw an error if an answer does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(Answer.get(fakeId, txn)).rejects.toMatch(`No such answer: ${fakeId}`);
  });

  it('edits answer', async () => {
    const { riskArea } = await setup(txn);
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
    const updatedAt = answer.updatedAt;

    expect(answer.displayValue).toEqual('loves writing tests!');
    const editedRiskArea = await Answer.edit(
      { displayValue: 'luvs writing tests!' },
      answer.id,
      txn,
    );
    expect(editedRiskArea.updatedAt).not.toEqual(updatedAt);
    expect(editedRiskArea.displayValue).toEqual('luvs writing tests!');
  });

  it('gets answers for question', async () => {
    const { riskArea } = await setup(txn);
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
    const answer1 = await Answer.create(
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
    const answer2 = await Answer.create(
      {
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 2,
      },
      txn,
    );
    const deletedAnswer = await Answer.create(
      {
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 2,
      },
      txn,
    );
    await Answer.delete(deletedAnswer.id, txn);

    expect(await Answer.getAllForQuestion(question.id, txn)).toMatchObject([answer1, answer2]);
  });

  it('gets an answer for a computed field slug and value', async () => {
    const { riskArea } = await setup(txn);
    const computedField = await ComputedField.create(
      {
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'number' as ComputedFieldDataTypes,
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'like writing tests?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        computedFieldId: computedField.id,
      },
      txn,
    );
    const answer1 = await Answer.create(
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
    await Answer.create(
      {
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 2,
      },
      txn,
    );
    const fetchedAnswer = await Answer.getByComputedFieldSlugAndValue(
      {
        slug: 'computed-field',
        value: answer1.value,
      },
      txn,
    );

    expect(fetchedAnswer!.id).toEqual(answer1.id);
    expect(fetchedAnswer!.value).toEqual(answer1.value);
  });

  it('returns null when getting an answer for an invalid computed field slug/value', async () => {
    const { riskArea } = await setup(txn);
    const computedField = await ComputedField.create(
      {
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'number' as ComputedFieldDataTypes,
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'like writing tests?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        computedFieldId: computedField.id,
      },
      txn,
    );
    await Answer.create(
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
    await Answer.create(
      {
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number' as AnswerValueTypeOptions,
        riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
        inSummary: false,
        questionId: question.id,
        order: 2,
      },
      txn,
    );
    const fetchedAnswer = await Answer.getByComputedFieldSlugAndValue(
      {
        slug: 'computed-field',
        value: 'random value',
      },
      txn,
    );

    expect(fetchedAnswer).toBeNull();
  });
});
