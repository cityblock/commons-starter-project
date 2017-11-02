import * as uuid from 'uuid/v4';
import Db from '../../db';
import Answer from '../answer';
import ProgressNoteTemplate from '../progress-note-template';
import Question from '../question';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';

describe('question model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let progressNoteTemplate: ProgressNoteTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    screeningTool = await ScreeningTool.create({
      title: 'screening tool',
      riskAreaId: riskArea.id,
    });
    progressNoteTemplate = await ProgressNoteTemplate.create({
      title: 'progress note template',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a question', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(await Question.get(question.id)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
  });

  it('creates and gets a question for a screening tool', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      type: 'screeningTool',
      order: 1,
    });
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      order: 1,
    });
    expect(await Question.get(question.id)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      order: 1,
    });
  });

  it('creates and gets a question for a progress note template', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      type: 'progressNoteTemplate',
      order: 1,
    });
    expect(question).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      order: 1,
    });
    expect(await Question.get(question.id)).toMatchObject({
      title: 'testing?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      order: 1,
    });
  });

  it('should throw an error if a question does not exist for the id', async () => {
    const fakeId = uuid();
    await expect(Question.get(fakeId)).rejects.toMatch(`No such question: ${fakeId}`);
  });

  it('edits question', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    expect(await Question.edit({ title: 'Testing?' }, question.id)).toMatchObject({
      title: 'Testing?',
    });
  });

  it('gets questions for risk area', async () => {
    const question1 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    const question2 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 2,
    });
    const question3 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 3,
    });
    const fetchedQuestions = await Question.getAllForRiskArea(riskArea.id);
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('gets questions for screening tool', async () => {
    const question1 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      type: 'screeningTool',
      order: 1,
    });
    const question2 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      screeningToolId: screeningTool.id,
      type: 'screeningTool',
      order: 2,
    });
    const question3 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 3,
    });
    const fetchedQuestions = await Question.getAllForScreeningTool(screeningTool.id);
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('gets questions for progress note template', async () => {
    const question1 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      type: 'progressNoteTemplate',
      order: 1,
    });
    const question2 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      progressNoteTemplateId: progressNoteTemplate.id,
      type: 'progressNoteTemplate',
      order: 2,
    });
    const question3 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 3,
    });
    const fetchedQuestions = await Question.getAllForProgressNoteTemplate(progressNoteTemplate.id);
    const fetchedQuestionIds = fetchedQuestions.map(q => q.id);
    expect(fetchedQuestions[0].id).toEqual(question1.id);
    expect(fetchedQuestions[1].id).toEqual(question2.id);
    expect(fetchedQuestionIds).not.toContain(question3.id);
  });

  it('eager loads answers ordered by...order', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    const answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });
    const answer2 = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    const deletedAnswer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    await Answer.delete(deletedAnswer.id);
    const fetched = await Question.get(question.id);
    expect(fetched.answers).toMatchObject([answer2, answer]);
  });

  it('deletes question', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    });
    expect(question.deletedAt).toBeNull();
    const deleted = await Question.delete(question.id);
    expect(deleted.deletedAt).not.toBeNull();
  });
});
