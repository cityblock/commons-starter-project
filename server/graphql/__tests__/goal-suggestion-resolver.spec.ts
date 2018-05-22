import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
import * as goalSuggestionTemplateForAnswer from '../../../app/graphql/queries/get-goal-suggestions-for-answer.graphql';
import * as goalSuggestionCreate from '../../../app/graphql/queries/goal-suggestion-create-mutation.graphql';
import * as goalSuggestionDelete from '../../../app/graphql/queries/goal-suggestion-delete-mutation.graphql';

import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import GoalSuggestion from '../../models/goal-suggestion';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import Question from '../../models/question';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  answer: Answer;
  goalSuggestionTemplate: GoalSuggestionTemplate;
  user: User;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(trx: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, trx);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown' as AnswerTypeOptions,
      riskAreaId: riskArea.id,
      type: 'riskArea',
      order: 1,
    },
    trx,
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
    trx,
  );
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Fix housing',
    },
    trx,
  );

  return { answer, goalSuggestionTemplate, user };
}

describe('goal suggestion resolver', () => {
  let txn = null as any;
  const goalSuggestionTemplateForAnswerQuery = print(goalSuggestionTemplateForAnswer);
  const goalSuggestionCreateMutation = print(goalSuggestionCreate);
  const goalSuggestionDeleteMutation = print(goalSuggestionDelete);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve goals for answer', () => {
    it('fetches a goal', async () => {
      const { answer, goalSuggestionTemplate, user } = await setup(txn);
      const result = await graphql(
        schema,
        goalSuggestionTemplateForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        { answerId: answer.id },
      );
      // null if no suggested goals
      expect(cloneDeep(result.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([]);

      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      // one if suggested goal
      const result2 = await graphql(
        schema,
        goalSuggestionTemplateForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        { answerId: answer.id },
      );
      expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([
        { title: 'Fix housing' },
      ]);
    });
  });

  describe('goal suggestion create', () => {
    it('suggests a goal for an answer', async () => {
      const { answer, goalSuggestionTemplate, user } = await setup(txn);
      const result = await graphql(
        schema,
        goalSuggestionCreateMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
      );
      expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
        {
          title: 'Fix housing',
        },
      ]);
    });

    it('suggests a goal for a screening tool score range', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const riskArea = await createRiskArea({ title: 'Also Risk Area' }, txn);
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
        goalSuggestionCreateMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          screeningToolScoreRangeId: screeningToolScoreRange.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
      );
      expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
        {
          title: 'Fix housing',
        },
      ]);
    });
  });

  describe('goal suggestion delete', () => {
    it('unsuggests a goal for an answer', async () => {
      const { answer, goalSuggestionTemplate, user } = await setup(txn);
      await GoalSuggestion.create(
        {
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          answerId: answer.id,
        },
        txn,
      );
      const result = await graphql(
        schema,
        goalSuggestionDeleteMutation,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        {
          answerId: answer.id,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
        },
      );
      expect(cloneDeep(result.data!.goalSuggestionDelete)).toMatchObject([]);

      // empty with no suggested goals
      const result2 = await graphql(
        schema,
        goalSuggestionTemplateForAnswerQuery,
        null,
        { userId: user.id, permissions, testTransaction: txn },
        { answerId: answer.id },
      );
      expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([]);
    });
  });
});
