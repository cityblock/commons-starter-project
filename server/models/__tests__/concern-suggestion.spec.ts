import Db from '../../db';
import Answer from '../answer';
import Concern from '../concern';
import ConcernSuggestion from '../concern-suggestion';
import Question from '../question';
import RiskArea from '../risk-area';

describe('concern suggestion model', () => {
  let db: Db;
  let answer: Answer;
  let question: Question;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    const riskArea = await RiskArea.create({
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

  describe('concern suggestion methods', () => {
    it('should associate multiple answers with a concern', async () => {
      const answer2 = await Answer.create({
        displayValue: 'loves writing more tests!',
        value: '2',
        valueType: 'number',
        riskAdjustmentType: 'forceHighRisk',
        inSummary: false,
        questionId: question.id,
        order: 2,
      });
      const concern = await Concern.create({ title: 'Housing' });

      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer2.id,
      });

      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id);
      const answersForConcern = await ConcernSuggestion.getForConcern(concern.id);

      expect(concernsForAnswer[0].id).toEqual(concern.id);
      expect(answersForConcern[0].id).toEqual(answer.id);
      expect(answersForConcern[1].id).toEqual(answer2.id);
    });

    it('throws an error if adding a non-existant concern to an answer', async () => {
      const error = 'insert into "concern_suggestion" ("answerId", "concernId", "id") values ' +
      '($1, $2, $3) returning "id" - insert or update on table "concern_suggestion" ' +
      'violates foreign key constraint "concern_suggestion_concernid_foreign"';

      await expect(
        ConcernSuggestion.create({
          concernId: 'does-not-exist',
          answerId: answer.id,
        }),
      ).rejects.toMatchObject({ message: error });
    });

    it('can remove an answer from a concern', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      const concernsForAnswer = await ConcernSuggestion.getForAnswer(answer.id);
      expect(concernsForAnswer[0].id).toEqual(concern.id);

      const concernAnswerResponse = await ConcernSuggestion.delete({
        concernId: concern.id,
        answerId: answer.id,
      });
      expect(concernAnswerResponse).toMatchObject([]);
      expect(await ConcernSuggestion.getForAnswer(answer.id)).toEqual([]);
    });
  });
});
