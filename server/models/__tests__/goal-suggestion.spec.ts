import Db from '../../db';
import Answer from '../answer';
import GoalSuggestion from '../goal-suggestion';
import GoalSuggestionTemplate from '../goal-suggestion-template';
import Question from '../question';
import RiskArea from '../risk-area';

describe('goal suggestion model', () => {
  let db: Db;
  let answer: Answer;
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

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
    answer = await Answer.create({
      displayValue: 'loves writing tests!',
      value: '3',
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    });
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({ title: 'Fix housing' });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('goal suggestion methods', () => {
    it('should associate multiple goal suggestions with an answer', async () => {
      const goalSuggestionTemplate2 = await GoalSuggestionTemplate.create({ title: 'fix Medical' });

      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate2.id,
        answerId: answer.id,
      });

      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id);
      const answersForGoalSuggestion = await GoalSuggestion.getForGoalSuggestion(
        goalSuggestionTemplate.id,
      );

      expect(answersForGoalSuggestion[0].id).toEqual(answer.id);
      expect(goalSuggestionsForAnswer[0].id).toEqual(goalSuggestionTemplate.id);
      expect(goalSuggestionsForAnswer[1].id).toEqual(goalSuggestionTemplate2.id);
    });

    it('throws an error if adding a non-existant goal suggestion to an answer', async () => {
      const error = 'insert into \"goal_suggestion\" (\"answerId\", \"goalSuggestionTemplateId\",' +
        ' \"id\") values ($1, $2, $3) returning \"id\" - insert or update on table ' +
        '\"goal_suggestion\" violates foreign key constraint ' +
        '\"goal_suggestion_goalsuggestiontemplateid_foreign\"';

      await expect(
        GoalSuggestion.create({
          goalSuggestionTemplateId: 'does-not-exist',
          answerId: answer.id,
        }),
      ).rejects.toMatchObject({ message: error });
    });

    it('can remove an answer from a goal suggestion', async () => {
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      const goalSuggestionsForAnswer = await GoalSuggestion.getForAnswer(answer.id);
      expect(goalSuggestionsForAnswer[0].id).toEqual(goalSuggestionTemplate.id);

      const concernAnswerResponse = await GoalSuggestion.delete({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      expect(concernAnswerResponse).toMatchObject([]);
      expect(await GoalSuggestion.getForAnswer(answer.id)).toEqual([]);
    });
  });
});
