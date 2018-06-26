import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import concernSuggestionCreate from '../../../app/graphql/queries/concern-suggestion-create-mutation.graphql';
import concernSuggestionDelete from '../../../app/graphql/queries/concern-suggestion-delete-mutation.graphql';
import getConcernSuggestionsForAnswer from '../../../app/graphql/queries/get-concern-suggestions-for-answer.graphql';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Concern from '../../models/concern';
import ConcernSuggestion from '../../models/concern-suggestion';
import Question from '../../models/question';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  answer: Answer;
  user: User;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
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
      order: 1,
    },
    txn,
  );

  return { answer, user };
}

describe('concern suggestion resolver', () => {
  let txn = null as any;
  const concernSuggestionCreateMutation = print(concernSuggestionCreate);
  const concernSuggestionDeleteMutation = print(concernSuggestionDelete);
  const getConcernSuggestionsForAnswerQuery = print(getConcernSuggestionsForAnswer);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve concern suggestion for answer', () => {
    it('fetches a concern suggestion', async () => {
      const { answer, user } = await setup(txn);
      const concern = await Concern.create({ title: 'Housing' }, txn);
      const result = await graphql(
        schema,
        getConcernSuggestionsForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          concernId: concern.id,
        },
      );
      // null if no suggested concerns
      expect(cloneDeep(result.data!.concernsForAnswer)).toMatchObject([]);

      await ConcernSuggestion.create(
        {
          concernId: concern.id,
          answerId: answer.id,
        },
        txn,
      );
      // one if suggested concern
      const result2 = await graphql(
        schema,
        getConcernSuggestionsForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result2.data!.concernsForAnswer)).toMatchObject([{ title: 'Housing' }]);
    });
  });

  describe('concern suggestion create', () => {
    it('suggests a concern for an answer', async () => {
      const { answer, user } = await setup(txn);
      const concern = await Concern.create({ title: 'Housing' }, txn);
      const result = await graphql(
        schema,
        concernSuggestionCreateMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernSuggestionCreate)).toMatchObject([
        {
          title: 'Housing',
        },
      ]);
    });

    it('suggests a concern for a screening tool score range', async () => {
      const { user } = await setup(txn);
      const riskArea = await createRiskArea({ title: 'Risk Area Also' }, txn);
      const concern = await Concern.create({ title: 'No Housing' }, txn);
      const screeningTool = await ScreeningTool.create(
        {
          title: 'Screening Tool',
          riskAreaId: riskArea.id,
        },
        txn,
      );
      const screeningToolScoreRange = await ScreeningToolScoreRange.create(
        {
          description: 'Score Range',
          screeningToolId: screeningTool.id,
          minimumScore: 0,
          maximumScore: 10,
        },
        txn,
      );
      const result = await graphql(
        schema,
        concernSuggestionCreateMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          screeningToolScoreRangeId: screeningToolScoreRange.id,
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernSuggestionCreate)).toMatchObject([
        {
          title: 'No Housing',
        },
      ]);
    });
  });

  describe('concern suggestion delete', () => {
    it('unsuggests a concern for an answer', async () => {
      const { answer, user } = await setup(txn);
      const concern = await Concern.create({ title: 'housing' }, txn);
      await ConcernSuggestion.create(
        {
          concernId: concern.id,
          answerId: answer.id,
        },
        txn,
      );
      const result = await graphql(
        schema,
        concernSuggestionDeleteMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          concernId: concern.id,
        },
      );
      expect(cloneDeep(result.data!.concernSuggestionDelete)).toMatchObject([]);

      const result2 = await graphql(
        schema,
        getConcernSuggestionsForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
        },
      );
      // null with no suggested concerns
      expect(cloneDeep(result2.data!.concernsForAnswer)).toMatchObject([]);
    });
  });
});
