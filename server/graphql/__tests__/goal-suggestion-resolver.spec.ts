import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
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

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const question = await Question.create(
    {
      title: 'like writing tests?',
      answerType: 'dropdown',
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
      valueType: 'number',
      riskAdjustmentType: 'forceHighRisk',
      inSummary: false,
      questionId: question.id,
      order: 1,
    },
    txn,
  );
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Fix housing',
    },
    txn,
  );

  return { answer, goalSuggestionTemplate, user };
}

describe('goal suggestion resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve goals for answer', () => {
    it('fetches a goal', async () => {
      await transaction(GoalSuggestion.knex(), async txn => {
        const { answer, goalSuggestionTemplate, user } = await setup(txn);
        const query = `{ goalSuggestionTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result = await graphql(schema, query, null, { userId: user.id, permissions, txn });
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
        const result2 = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([
          { title: 'Fix housing' },
        ]);
      });
    });
  });

  describe('goal suggestion create', () => {
    it('suggests a goal for an answer', async () => {
      await transaction(GoalSuggestion.knex(), async txn => {
        const { answer, goalSuggestionTemplate, user } = await setup(txn);
        const mutation = `mutation {
          goalSuggestionCreate(
            input: {
              answerId: "${answer.id}", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
            }
          ) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
          {
            title: 'Fix housing',
          },
        ]);
      });
    });

    it('suggests a goal for a screening tool score range', async () => {
      await transaction(GoalSuggestion.knex(), async txn => {
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
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.goalSuggestionCreate)).toMatchObject([
          {
            title: 'Fix housing',
          },
        ]);
      });
    });
  });

  describe('goal suggestion delete', () => {
    it('unsuggests a goal for an answer', async () => {
      await transaction(GoalSuggestion.knex(), async txn => {
        const { answer, goalSuggestionTemplate, user } = await setup(txn);
        await GoalSuggestion.create(
          {
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            answerId: answer.id,
          },
          txn,
        );
        const mutation = `mutation {
          goalSuggestionDelete(input: {
            answerId: "${answer.id}", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
          }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.goalSuggestionDelete)).toMatchObject([]);

        // empty with no suggested goals
        const query = `{ goalSuggestionTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result2 = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result2.data!.goalSuggestionTemplatesForAnswer)).toMatchObject([]);
      });
    });
  });
});
