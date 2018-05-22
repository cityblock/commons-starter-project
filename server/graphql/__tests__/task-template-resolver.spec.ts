import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { Priority, UserRole } from 'schema';
import Clinic from '../../models/clinic';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import TaskTemplate from '../../models/task-template';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  goalSuggestionTemplate: GoalSuggestionTemplate;
  user: User;
}

const userRole = 'admin' as UserRole;
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Housing',
    },
    txn,
  );

  return { goalSuggestionTemplate, user };
}

describe('task template resolver', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
    txn = null;
  });

  describe('resolve task template', () => {
    it('fetches a taskTemplate', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const query = `{ taskTemplate(taskTemplateId: "${taskTemplate.id}") { title } }`;
      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskTemplate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('task template create', () => {
    it('creates a task template', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const mutation = `mutation {
          taskTemplateCreate(input: {
            title: "Housing",
            repeating: false,
            goalSuggestionTemplateId: "${goalSuggestionTemplate.id}",
            priority: low,
            careTeamAssigneeRole: "physician",
          }) {
            title
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });

      expect(cloneDeep(result.data!.taskTemplateCreate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('task template edit', () => {
    it('edits a task template', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const mutation = `mutation {
          taskTemplateEdit(input: { title: "Medical", taskTemplateId: "${taskTemplate.id}" }) {
            title
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskTemplateEdit)).toMatchObject({
        title: 'Medical',
      });
    });
  });

  describe('task template delete', () => {
    it('deletes a task template', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const taskTemplate = await TaskTemplate.create(
        {
          title: 'Housing',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const mutation = `mutation {
          taskTemplateDelete(input: { taskTemplateId: "${taskTemplate.id}" }) {
            title, deletedAt
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.taskTemplateDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('task templates', () => {
    it('returns task templates', async () => {
      const { goalSuggestionTemplate, user } = await setup(txn);
      const taskTemplate1 = await TaskTemplate.create(
        {
          title: 'Housing 1',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const taskTemplate2 = await TaskTemplate.create(
        {
          title: 'Housing 2',
          repeating: false,
          goalSuggestionTemplateId: goalSuggestionTemplate.id,
          priority: 'low' as Priority,
          careTeamAssigneeRole: 'physician' as UserRole,
        },
        txn,
      );
      const query = `{
          taskTemplates { title }
        }`;

      const result = await graphql(schema, query, null, {
        userId: user.id,
        permissions,
        testTransaction: txn,
      });
      const taskTemplates = cloneDeep(result.data!.taskTemplates);
      const titles = taskTemplates.map((taskTemplate: TaskTemplate) => taskTemplate.title);
      expect(taskTemplates.length).toEqual(2);
      expect(titles).toContain(taskTemplate1.title);
      expect(titles).toContain(taskTemplate2.title);
    });
  });
});
