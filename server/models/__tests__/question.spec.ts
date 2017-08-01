import Db from '../../db';
import Answer from '../answer';
import Question from '../question';
import RiskArea from '../risk-area';

describe('answer model', () => {
  let db: Db;
  let riskArea: RiskArea;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
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

  it('should throw an error if a question does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(Question.get(fakeId))
      .rejects
      .toMatch('No such question: fakeId');
  });

  it('edits question', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(await Question.edit({ title: 'Testing?' }, question.id))
      .toMatchObject({
        title: 'Testing?',
      });
  });

  it('gets questions for risk area', async () => {
    const question1 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const question2 = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 2,
    });
    expect(await Question.getAllForRiskArea(riskArea.id))
      .toMatchObject([question1, question2]);
  });

  it('eager loads answers', async () => {
    const question = await Question.create({
      title: 'testing?',
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
    expect(fetched.answers).toMatchObject([answer]);
  });

  it('deletes question', async () => {
    const question = await Question.create({
      title: 'testing?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    expect(question.deletedAt).toBeNull();
    const deleted = await Question.delete(question.id);
    expect(deleted.deletedAt).not.toBeNull();
  });
});
