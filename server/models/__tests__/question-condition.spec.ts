import Db from '../../db';
import Answer from '../answer';
import Question from '../question';
import QuestionCondition from '../question-condition';
import RiskArea from '../risk-area';

describe('answer model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let question: Question;
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
      answerId: answer.id, questionId: question.id,
    });
    expect(questionCondition).toMatchObject({
      answerId: answer.id,
      questionId: question.id,
    });
    const queriedQuestionCondition = await QuestionCondition.get(questionCondition.id);
    expect(queriedQuestionCondition).toMatchObject({
      answerId: answer.id, questionId: question.id,
    });
    expect(queriedQuestionCondition.question).toMatchObject(question);
    expect(queriedQuestionCondition.answer).toMatchObject(answer);
  });

  it('creates and gets questionCondition', async () => {
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question.id,
    });
    expect(questionCondition).toMatchObject({
      answerId: answer.id,
      questionId: question.id,
    });
    expect(await QuestionCondition.get(questionCondition.id)).toMatchObject({
      answerId: answer.id, questionId: question.id,
    });
  });

  it('should throw an error if a patient does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(QuestionCondition.get(fakeId))
      .rejects
      .toMatch('No such questionCondition: fakeId');
  });

  it('cannot create questionCondition for answer that is not on question', async () => {
    const question2 = await Question.create({
      title: 'question 2',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    await expect(QuestionCondition.create({ answerId: answer.id, questionId: question2.id }))
      .rejects
      .toMatch(`Question ${question2.id} is not associated with answer ${answer.id}`);
  });

  it('cannot edit questionCondition for answer that is not on question', async () => {
    const question2 = await Question.create({
      title: 'question 2',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question.id,
    });
    await expect(
      QuestionCondition.edit(
        { answerId: answer.id, questionId: question2.id },
        questionCondition.id),
    )
      .rejects
      .toMatch(`Question ${question2.id} is not associated with answer ${answer.id}`);
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
      answerId: answer.id, questionId: question.id,
    });
    expect(
      await QuestionCondition.edit(
        { answerId: answer2.id, questionId: question.id },
        questionCondition.id),
    )
      .toMatchObject({
        answerId: answer2.id,
        questionId: question.id,
      });
  });

  it('deletes questionCondition', async () => {
    const questionCondition = await QuestionCondition.create({
      answerId: answer.id, questionId: question.id,
    });
    expect(questionCondition.deletedAt).toBeNull();
    const deleted = await QuestionCondition.delete(questionCondition.id);
    expect(deleted.deletedAt).not.toBeNull();
  });
});
