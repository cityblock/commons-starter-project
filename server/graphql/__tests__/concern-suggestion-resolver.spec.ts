import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Answer from '../../models/answer';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import schema from '../make-executable-schema';

describe('concern suggestion resolver', () => {
  let db: Db;
  const userRole = 'admin';
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

  describe('resolve concern suggestion for answer', () => {
    it('fetches a concern suggestion', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      const query = `{ concernsForAnswer(answerId: "${answer.id}") { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      // null if no suggested concerns
      expect(cloneDeep(result.data!.concernsForAnswer)).toMatchObject([]);

      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      // one if suggested concern
      const result2 = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result2.data!.concernsForAnswer)).toMatchObject([{ title: 'Housing' }]);
    });
  });

  describe('concern suggestion create', () => {
    it('suggests a concern for an answer', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      const mutation = `mutation {
        concernSuggestionCreate(
          input: { answerId: "${answer.id}", concernId: "${concern.id}" }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernSuggestionCreate)).toMatchObject([
        {
          title: 'Housing',
        },
      ]);
    });

    it('suggests a concern for a screening tool score range', async () => {
      const riskArea = await RiskArea.create({ title: 'Housing', order: 1 });
      const concern = await Concern.create({ title: 'No Housing' });
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
        concernSuggestionCreate(
          input: {
            screeningToolScoreRangeId: "${screeningToolScoreRange.id}"
            concernId: "${concern.id}"
          }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernSuggestionCreate)).toMatchObject([
        {
          title: 'No Housing',
        },
      ]);
    });
  });

  describe('concern suggestion delete', () => {
    it('unsuggests a concern for an answer', async () => {
      const concern = await Concern.create({ title: 'housing' });
      await ConcernSuggestion.create({
        concernId: concern.id,
        answerId: answer.id,
      });
      const mutation = `mutation {
        concernSuggestionDelete(input: { answerId: "${answer.id}", concernId: "${concern.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernSuggestionDelete)).toMatchObject([]);
      const query = `{ concernsForAnswer(answerId: "${answer.id}") { title } }`;
      const result2 = await graphql(schema, query, null, { userRole });
      // null with no suggested concerns
      expect(cloneDeep(result2.data!.concernsForAnswer)).toMatchObject([]);
    });
  });
});
