import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import TaskTemplate from '../../models/task-template';
import schema from '../make-executable-schema';

interface ISetup {
  goalSuggestionTemplate: GoalSuggestionTemplate;
}

const userRole = 'admin';

async function setup(txn: Transaction): Promise<ISetup> {
  const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
    {
      title: 'Housing',
    },
    txn,
  );

  return { goalSuggestionTemplate };
}

describe('task template resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve task template', () => {
    it('fetches a taskTemplate', async () => {
      await transaction(TaskTemplate.knex(), async txn => {
        const { goalSuggestionTemplate } = await setup(txn);
        const taskTemplate = await TaskTemplate.create(
          {
            title: 'Housing',
            repeating: false,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            priority: 'low',
            careTeamAssigneeRole: 'physician',
          },
          txn,
        );
        const query = `{ taskTemplate(taskTemplateId: "${taskTemplate.id}") { title } }`;
        const result = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result.data!.taskTemplate)).toMatchObject({
          title: 'Housing',
        });
      });
    });
  });

  describe('task template create', () => {
    it('creates a task template', async () => {
      await transaction(TaskTemplate.knex(), async txn => {
        const { goalSuggestionTemplate } = await setup(txn);
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
        const result = await graphql(schema, mutation, null, { userRole, txn });

        expect(cloneDeep(result.data!.taskTemplateCreate)).toMatchObject({
          title: 'Housing',
        });
      });
    });
  });

  describe('task template edit', () => {
    it('edits a task template', async () => {
      await transaction(TaskTemplate.knex(), async txn => {
        const { goalSuggestionTemplate } = await setup(txn);
        const taskTemplate = await TaskTemplate.create(
          {
            title: 'Housing',
            repeating: false,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            priority: 'low',
            careTeamAssigneeRole: 'physician',
          },
          txn,
        );
        const mutation = `mutation {
          taskTemplateEdit(input: { title: "Medical", taskTemplateId: "${taskTemplate.id}" }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.taskTemplateEdit)).toMatchObject({
          title: 'Medical',
        });
      });
    });
  });

  describe('task template delete', () => {
    it('deletes a task template', async () => {
      await transaction(TaskTemplate.knex(), async txn => {
        const { goalSuggestionTemplate } = await setup(txn);
        const taskTemplate = await TaskTemplate.create(
          {
            title: 'Housing',
            repeating: false,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            priority: 'low',
            careTeamAssigneeRole: 'physician',
          },
          txn,
        );
        const mutation = `mutation {
          taskTemplateDelete(input: { taskTemplateId: "${taskTemplate.id}" }) {
            title, deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.taskTemplateDelete).deletedAt).not.toBeFalsy();
      });
    });
  });

  describe('task templates', () => {
    it('returns task templates', async () => {
      await transaction(TaskTemplate.knex(), async txn => {
        const { goalSuggestionTemplate } = await setup(txn);
        const taskTemplate1 = await TaskTemplate.create(
          {
            title: 'Housing 1',
            repeating: false,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            priority: 'low',
            careTeamAssigneeRole: 'physician',
          },
          txn,
        );
        const taskTemplate2 = await TaskTemplate.create(
          {
            title: 'Housing 2',
            repeating: false,
            goalSuggestionTemplateId: goalSuggestionTemplate.id,
            priority: 'low',
            careTeamAssigneeRole: 'physician',
          },
          txn,
        );
        const query = `{
          taskTemplates { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });
        const taskTemplates = cloneDeep(result.data!.taskTemplates);
        const titles = taskTemplates.map((taskTemplate: TaskTemplate) => taskTemplate.title);
        expect(taskTemplates.length).toEqual(2);
        expect(titles).toContain(taskTemplate1.title);
        expect(titles).toContain(taskTemplate2.title);
      });
    });
  });
});
