import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  ComputedFieldDataTypes,
  RiskAdjustmentTypeOptions,
} from 'schema';
import * as uuid from 'uuid/v4';

import { createRiskArea } from '../../spec-helpers';
import Answer from '../answer';
import ComputedField from '../computed-field';
import ProgressNoteTemplate from '../progress-note-template';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';

interface ISetup {
  riskArea: RiskArea;
  screeningTool: ScreeningTool;
  progressNoteTemplate: ProgressNoteTemplate;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'testing' }, txn);
  const screeningTool = await ScreeningTool.create(
    {
      title: 'screening tool',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const progressNoteTemplate = await ProgressNoteTemplate.create(
    {
      title: 'progress note template',
    },
    txn,
  );
  return { riskArea, screeningTool, progressNoteTemplate };
}

describe('question model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Question.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and gets a question', async () => {
    const { riskArea } = await setup(txn);

    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      },
      txn,
    );
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(await Question.get(question.id, txn)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      order: 1,
    });
  });

  it('creates and gets a question for a screening tool', async () => {
    const { screeningTool } = await setup(txn);

    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
      },
      txn,
    );
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      screeningToolId: screeningTool.id,
      order: 1,
    });
    expect(await Question.get(question.id, txn)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      screeningToolId: screeningTool.id,
      order: 1,
    });
  });

  it('creates and gets a question for a progress note template', async () => {
    const { progressNoteTemplate } = await setup(txn);

    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        progressNoteTemplateId: progressNoteTemplate.id,
        type: 'progressNoteTemplate',
        order: 1,
      },
      txn,
    );
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      progressNoteTemplateId: progressNoteTemplate.id,
      order: 1,
    });
    expect(await Question.get(question.id, txn)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      progressNoteTemplateId: progressNoteTemplate.id,
      order: 1,
    });
  });

  it('creates and gets a computed field question and auto-sets answerType', async () => {
    const { riskArea } = await setup(txn);

    const computedField = await ComputedField.create(
      {
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean' as ComputedFieldDataTypes,
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        computedFieldId: computedField.id,
      },
      txn,
    );
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'radio', // answerType gets overwritten with radio for computedField questions
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(await Question.get(question.id, txn)).toMatchObject({
      title: 'testing?',
      answerType: 'radio',
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(question.computedField).toEqual(computedField);
  });

  it('creates a question with an "other" answer', async () => {
    const { riskArea } = await setup(txn);
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        hasOtherTextAnswer: true,
      },
      txn,
    );
    const answers = await Answer.getAllForQuestion(question.id, txn);
    expect(answers.length).toEqual(1);
    expect(question.otherTextAnswerId).toEqual(answers[0].id);
    expect(await Question.get(question.id, txn)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      order: 1,
      otherTextAnswerId: answers[0].id,
    });
  });

  it('does not create an "other" answer for a non-dropdown question', async () => {
    const { riskArea } = await setup(txn);
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'radio' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        hasOtherTextAnswer: true,
      },
      txn,
    );
    const fetchedQuestion = await Question.get(question.id, txn);
    const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
    expect(fetchedQuestion.otherTextAnswerId).toBeNull();
    expect(fetchedAnswers.length).toEqual(0);
  });

  it('does not create an "other" answer for a computed field question', async () => {
    const { riskArea } = await setup(txn);
    const computedField = await ComputedField.create(
      {
        dataType: 'string' as ComputedFieldDataTypes,
        label: 'computed field',
        slug: 'computed-field',
      },
      txn,
    );
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        computedFieldId: computedField.id,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        hasOtherTextAnswer: true,
      },
      txn,
    );
    const fetchedQuestion = await Question.get(question.id, txn);
    const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
    expect(fetchedQuestion.otherTextAnswerId).toBeNull();
    expect(fetchedAnswers.length).toEqual(0);
  });

  it('does not create an "other" answer for a screening tool question', async () => {
    const { screeningTool } = await setup(txn);
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
        hasOtherTextAnswer: true,
      },
      txn,
    );
    const fetchedQuestion = await Question.get(question.id, txn);
    const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
    expect(fetchedQuestion.otherTextAnswerId).toBeNull();
    expect(fetchedAnswers.length).toEqual(0);
  });

  it('should throw an error if a question does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(Question.get(fakeId, txn)).rejects.toMatch(`No such question: ${fakeId}`);
  });

  it('edits question', async () => {
    const { riskArea } = await setup(txn);
    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      },
      txn,
    );
    expect(await Question.edit({ title: 'Testing?' }, question.id, txn)).toMatchObject({
      title: 'Testing?',
    });
  });

  describe('editing a question with "other" answer type', () => {
    it('adds an "other" answer to a question that does not already have one', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      // Add the other answer
      await Question.edit(
        {
          hasOtherTextAnswer: true,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toEqual(refetchedAnswers[0].id);
      expect(refetchedAnswers.length).toEqual(1);
    });

    it('is a noop if adding an "other" answer to a question that already has one', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
          hasOtherTextAnswer: true,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).not.toBeNull();
      expect(fetchedAnswers.length).toEqual(1);

      // Try to add an other answer again
      await Question.edit(
        {
          hasOtherTextAnswer: true,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toEqual(fetchedAnswers[0].id);
      expect(refetchedAnswers.length).toEqual(1);
      expect(refetchedAnswers).toMatchObject(fetchedAnswers);
    });

    it('removes an "other" answer to a question that has one', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
          hasOtherTextAnswer: true,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).not.toBeNull();
      expect(fetchedAnswers.length).toEqual(1);

      // Remove the other answer
      await Question.edit(
        {
          hasOtherTextAnswer: false,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toBeNull();
      expect(refetchedAnswers.length).toEqual(0);
    });

    it('is a noop if removing an "other" answer from a question that lacks one', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      // Try to remove a non-existent other answer
      await Question.edit(
        {
          hasOtherTextAnswer: false,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toBeNull();
      expect(refetchedAnswers.length).toEqual(0);
    });

    it('is a noop if adding an "other" answer to a computed field question', async () => {
      const { riskArea } = await setup(txn);
      const computedField = await ComputedField.create(
        {
          dataType: 'string' as ComputedFieldDataTypes,
          label: 'computed field',
          slug: 'computed-field',
        },
        txn,
      );
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          computedFieldId: computedField.id,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      // Try to add an other answer
      await Question.edit(
        {
          hasOtherTextAnswer: true,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toBeNull();
      expect(refetchedAnswers.length).toEqual(0);
    });

    it('is a noop if adding an "other" answer to a screening tool question', async () => {
      const { screeningTool } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          screeningToolId: screeningTool.id,
          type: 'screeningTool',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      // Try to add an other answer
      await Question.edit(
        {
          hasOtherTextAnswer: true,
        },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).toBeNull();
      expect(refetchedAnswers.length).toEqual(0);
    });

    it('errors when changing answerType to non-dropdown for an "other" question', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'dropdown' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
          hasOtherTextAnswer: true,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).not.toBeNull();
      expect(fetchedAnswers.length).toEqual(1);

      await expect(
        Question.edit({ answerType: 'radio' as AnswerTypeOptions }, question.id, txn),
      ).rejects.toMatch('Cannot change answerType for a question with an "other" answer');
    });

    it('errors when adding "other" question to non-dropdown question', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'radio' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      await expect(Question.edit({ hasOtherTextAnswer: true }, question.id, txn)).rejects.toMatch(
        'Cannot add an "other" answer to a non-dropdown question',
      );
    });

    it('adds "other" answer to non-dropdown question when also changing to dropdown', async () => {
      const { riskArea } = await setup(txn);
      const question = await Question.create(
        {
          title: 'testing?',
          answerType: 'radio' as AnswerTypeOptions,
          riskAreaId: riskArea.id,
          type: 'riskArea',
          order: 1,
        },
        txn,
      );
      const fetchedQuestion = await Question.get(question.id, txn);
      const fetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(fetchedQuestion.otherTextAnswerId).toBeNull();
      expect(fetchedAnswers.length).toEqual(0);

      await Question.edit(
        { hasOtherTextAnswer: true, answerType: 'dropdown' as AnswerTypeOptions },
        question.id,
        txn,
      );

      const refetchedQuestion = await Question.get(question.id, txn);
      const refetchedAnswers = await Answer.getAllForQuestion(question.id, txn);
      expect(refetchedQuestion.otherTextAnswerId).not.toBeNull();
      expect(refetchedAnswers.length).toEqual(1);
    });
  });

  it('gets questions for risk area', async () => {
    const { riskArea, screeningTool } = await setup(txn);

    const question1 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      },
      txn,
    );
    const question2 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 2,
      },
      txn,
    );
    const question3 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 3,
      },
      txn,
    );
    const fetchedQuestions = await Question.getAllForRiskArea(riskArea.id, txn);
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('gets questions for screening tool', async () => {
    const { riskArea, screeningTool } = await setup(txn);

    const question1 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 1,
      },
      txn,
    );
    const question2 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        screeningToolId: screeningTool.id,
        type: 'screeningTool',
        order: 2,
      },
      txn,
    );
    const question3 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 3,
      },
      txn,
    );
    const fetchedQuestions = await Question.getAllForScreeningTool(screeningTool.id, txn);
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('gets questions for progress note template', async () => {
    const { riskArea, progressNoteTemplate } = await setup(txn);

    const question1 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        progressNoteTemplateId: progressNoteTemplate.id,
        type: 'progressNoteTemplate',
        order: 1,
      },
      txn,
    );
    const question2 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        progressNoteTemplateId: progressNoteTemplate.id,
        type: 'progressNoteTemplate',
        order: 2,
      },
      txn,
    );
    const question3 = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 3,
      },
      txn,
    );
    const fetchedQuestions = await Question.getAllForProgressNoteTemplate(
      progressNoteTemplate.id,
      txn,
    );
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('eager loads answers ordered by...order', async () => {
    const { riskArea } = await setup(txn);

    const question = await Question.create(
      {
        title: 'testing?',
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
        order: 2,
      },
      txn,
    );
    const answer2 = await Answer.create(
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
    const deletedAnswer = await Answer.create(
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
    await Answer.delete(deletedAnswer.id, txn);
    const fetched = await Question.get(question.id, txn);
    expect(fetched.answers).toMatchObject([answer2, answer]);
  });

  it('deletes question', async () => {
    const { riskArea } = await setup(txn);

    const question = await Question.create(
      {
        title: 'testing?',
        answerType: 'dropdown' as AnswerTypeOptions,
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
      },
      txn,
    );
    expect(question.deletedAt).toBeFalsy();
    const deleted = await Question.delete(question.id, txn);
    expect(deleted.deletedAt).not.toBeFalsy();
  });
});
