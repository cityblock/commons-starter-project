import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import Answer from '../../models/answer';
import Question from '../../models/question';
import TaskSuggestion from '../../models/task-suggestion';
import TaskTemplate from '../../models/task-template';
import { createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  answer: Answer;
  taskTemplate: TaskTemplate;
}

const userRole = 'admin';

async function setup(txn: Transaction): Promise<ISetup> {
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

  return { answer, taskTemplate };
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
        const { answer, taskTemplate } = await setup(txn);
        const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result = await graphql(schema, query, null, { userRole, txn });
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
        const result2 = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([
          { title: 'Housing' },
        ]);
      });
    });
  });

  describe('task suggestion create', () => {
    it('suggests a task for an answer', async () => {
      await transaction(TaskSuggestion.knex(), async txn => {
        const { answer, taskTemplate } = await setup(txn);
        const mutation = `mutation {
          taskSuggestionCreate(
            input: {
              answerId: "${answer.id}", taskTemplateId: "${taskTemplate.id}"
            }
          ) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
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
        const { taskTemplate, answer } = await setup(txn);
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
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.taskSuggestionDelete)).toMatchObject([]);

        // empty with no suggested tasks
        const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
        const result2 = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([]);
      });
    });
  });
});
