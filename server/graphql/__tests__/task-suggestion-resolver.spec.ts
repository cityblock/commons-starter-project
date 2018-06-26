import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import {
  AnswerTypeOptions,
  AnswerValueTypeOptions,
  Priority,
  RiskAdjustmentTypeOptions,
  UserRole,
} from 'schema';
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
      valueType: 'number' as AnswerValueTypeOptions,
      riskAdjustmentType: 'forceHighRisk' as RiskAdjustmentTypeOptions,
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
      priority: 'low' as Priority,
      careTeamAssigneeRole: 'Primary_Care_Physician' as UserRole,
    },
    txn,
  );

  return { answer, taskTemplate, user };
}

describe('task suggestion resolver', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
    txn = null;
  });

  describe('resolve tasks for answer', () => {
    it('fetches a task', async () => {
      const { answer, taskTemplate, user } = await setup(txn);
      const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
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
      const result2 = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([{ title: 'Housing' }]);
    });
  });

  describe('task suggestion create', () => {
    it('suggests a task for an answer', async () => {
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
      const result = await graphql(schema, mutation, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskSuggestionCreate)).toMatchObject([
        {
          title: 'Housing',
        },
      ]);
    });
  });

  describe('task suggestion delete', () => {
    it('unsuggests a task for an answer', async () => {
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
      const result = await graphql(schema, mutation, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskSuggestionDelete)).toMatchObject([]);

      // empty with no suggested tasks
      const query = `{ taskTemplatesForAnswer(answerId: "${answer.id}") { title } }`;
      const result2 = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result2.data!.taskTemplatesForAnswer)).toMatchObject([]);
    });
  });
});
