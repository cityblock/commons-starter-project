import Db from '../../db';
import Answer from '../answer';
import Question from '../question';
import QuestionCondition from '../question-condition';
import RiskArea from '../risk-area';

describe('answer model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let question: Question;
  let question2: Question;
  let answer: Answer;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

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
    question2 = await Question.create({
      title: 'really like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 2,
    });
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets questionCondition', async () => {
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question2.id,
    });
    expect(questionCondition).toMatchObject({
      answerId: answer.id,
      questionId: question2.id,
    });
    const queriedQuestionCondition = await QuestionCondition.get(questionCondition.id);
    expect(queriedQuestionCondition).toMatchObject({
      answerId: answer.id, questionId: question2.id,
    });
  });

  it('should throw an error if a patient does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(QuestionCondition.get(fakeId))
      .rejects
      .toMatch('No such questionCondition: fakeId');
  });

  it('cannot create questionCondition for answer that is on question', async () => {
    await expect(QuestionCondition.create({ answerId: answer.id, questionId: question.id }))
      .rejects
      .toMatch(`Error: Answer ${answer.id} is an answer to question ${question.id}`);
  });

  it('edits questionCondition for answer', async () => {
    const answer2 = await Answer.create({
      displayValue: 'meh about writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question2.id,
    });
    expect(
      await QuestionCondition.edit(
        { answerId: answer2.id, questionId: question2.id },
        questionCondition.id),
    )
      .toMatchObject({
        answerId: answer2.id,
        questionId: question2.id,
      });
  });

  it('deletes questionCondition', async () => {
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question2.id,
    });
    expect(questionCondition.deletedAt).toBeNull();
    const deleted = await QuestionCondition.delete(questionCondition.id);
    expect(deleted.deletedAt).not.toBeNull();
  });
});
