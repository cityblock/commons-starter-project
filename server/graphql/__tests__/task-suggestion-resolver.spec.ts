import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Answer from '../../models/answer';
import Clinic from '../../models/clinic';
import Question from '../../models/question';
import TaskSuggestion from '../../models/task-suggestion';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import { createRiskArea } from '../../spec-helpers';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  answer: Answer;
  taskTemplate: TaskTemplate;
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
      type: 'riskArea',
      riskAreaId: riskArea.id,
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
  const taskTemplate = await TaskTemplate.create(
    {
      title: 'Housing',
      repeating: false,
      priority: 'low',
      careTeamAssigneeRole: 'physician',
    },
    txn,
  );

  return { answer, taskTemplate, user };
}

describe('task suggestion resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve tasks for answer', () => {
    it('fetches a task', async () => {
      await transaction(TaskSuggestion.knex(), async txn => {
        const { answer, taskTemplate, user } = await setup(txn);
        const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        // null if no suggested tasks
        expect(cloneDeep(result.data!.taskTemplatesForAnswer)).toMatchObject([]);

        await TaskSuggestion.create(
          {
            taskTemplateId: taskTemplate.id,
            answerId: answer.id,
          },
          txn,
        );
        // one if suggested task
        const result2 = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([
          { title: 'Housing' },
        ]);
      });
    });
  });

  describe('task suggestion create', () => {
    it('suggests a task for an answer', async () => {
      await transaction(TaskSuggestion.knex(), async txn => {
        const { answer, taskTemplate, user } = await setup(txn);
        const mutation = `mutation {
          taskSuggestionCreate(
            input: {
              answerId: "${answer.id}", taskTemplateId: "${taskTemplate.id}"
            }
          ) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.taskSuggestionCreate)).toMatchObject([
          {
            title: 'Housing',
          },
        ]);
      });
    });
  });

  describe('task suggestion delete', () => {
    it('unsuggests a task for an answer', async () => {
      await transaction(TaskSuggestion.knex(), async txn => {
        const { taskTemplate, answer, user } = await setup(txn);
        await TaskSuggestion.create(
          {
            taskTemplateId: taskTemplate.id,
            answerId: answer.id,
          },
          txn,
        );
        const mutation = `mutation {
          taskSuggestionDelete(input: {
            answerId: "${answer.id}", taskTemplateId: "${taskTemplate.id}"
          }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result.data!.taskSuggestionDelete)).toMatchObject([]);

        // empty with no suggested tasks
        const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result2 = await graphql(schema, query, null, { userId: user.id, permissions, txn });
        expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([]);
      });
    });
  });
});
