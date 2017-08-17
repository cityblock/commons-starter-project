import Db from '../../db';
import Answer from '../answer';
import Question from '../question';
import RiskArea from '../risk-area';

describe('anser model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should creates and get an answer', async () => {
    const riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    const question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    expect(answer.displayValue).toEqual('loves writing tests!');
    expect(await Answer.get(answer.id)).toEqual(answer);
  });

  it('sets default riskAdjustmentType to inactive', async () => {
    const riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    const question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    expect(answer.riskAdjustmentType).toEqual('inactive');
  });

  it('should throw an error if an answer does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(Answer.get(fakeId))
      .rejects
      .toMatch('No such answer: fakeId');
  });

  it('edits answer', async () => {
    const riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    const question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    expect(answer.displayValue).toEqual('loves writing tests!');
    const editedRiskArea = await Answer.edit({ displayValue: 'luvs writing tests!' }, answer.id);
    expect(editedRiskArea.displayValue).toEqual('luvs writing tests!');
  });

  it('gets answers for question', async () => {
    const riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    const question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const answer1 = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    const answer2 = await Answer.create({
      displayValue: 'loves writing more tests!',
      value: '2',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });
    const deletedAnswer = await Answer.create({
      displayValue: 'loves writing more tests!',
      value: '2',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 2,
    });
    await Answer.delete(deletedAnswer.id);

    expect(await Answer.getAllForQuestion(question.id))
      .toMatchObject([answer1, answer2]);
  });
});
