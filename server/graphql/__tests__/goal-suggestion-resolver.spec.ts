import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import schema from '../make-executable-schema';

describe('goal suggestion resolver', () => {
  let db: Db;
  const userRole = 'admin';
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
    goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Fix housing',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve goals for answer', () => {
    it('fetches a goal', async () => {
      const query = `{ goalSuggestionTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      // null if no suggested goals
      expect(cloneDeep(result.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([]);

      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      // one if suggested goal
      const result2 = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([
        { title: 'Fix housing' },
      ]);
    });
  });

  describe('goal suggestion create', () => {
    it('suggests a goal for an answer', async () => {
      const mutation = `mutation {
        goalSuggestionCreate(
          input: {
            answerId: "${answer.id}", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
          }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
        {
          title: 'Fix housing',
        },
      ]);
    });

    it('suggests a goal for a screening tool score range', async () => {
      const riskArea = await RiskArea.create({ title: 'Housing', order: 1 });
      const screeningTool = await ScreeningTool.create({
        title: 'Screening Tool',
        riskAreaId: riskArea.id,
      });
      const screeningToolScoreRange = await ScreeningToolScoreRange.create({
        description: 'Score Range',
        screeningToolId: screeningTool.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      const mutation = `mutation {
        goalSuggestionCreate(
          input: {
            screeningToolScoreRangeId: "${screeningToolScoreRange.id}"
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
          }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
        {
          title: 'Fix housing',
        },
      ]);
    });
  });

  describe('goal suggestion delete', () => {
    it('unsuggests a goal for an answer', async () => {
      await GoalSuggestion.create({
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        answerId: answer.id,
      });
      const mutation = `mutation {
        goalSuggestionDelete(input: {
          answerId: "${answer.id}", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
        }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionDelete)).toMatchObject([]);

      // empty with no suggested goals
      const query = `{ goalSuggestionTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result2 = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([]);
    });
  });
});
