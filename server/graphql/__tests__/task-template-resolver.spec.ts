import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import TaskTemplate from '../../models/task-template';
import schema from '../make-executable-schema';

describe('task template resolver', () => {
  let db: Db;
  const userRole = 'admin';
  let goalSuggestionTemplate: GoalSuggestionTemplate;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    goalSuggestionTemplate = await GoalSuggestionTemplate.create({
      title: 'Housing',
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve task template', () => {
    it('fetches a taskTemplate', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const query = `{ taskTemplate(taskTemplateId: "${taskTemplate.id}") { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.taskTemplate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('task template create', () => {
    it('creates a task template', async () => {
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
      const result = await graphql(schema, mutation, null, { userRole });

      expect(cloneDeep(result.data!.taskTemplateCreate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('task template edit', () => {
    it('edits a task template', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const mutation = `mutation {
        taskTemplateEdit(input: { title: "Medical", taskTemplateId: "${taskTemplate.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.taskTemplateEdit)).toMatchObject({
        title: 'Medical',
      });
    });
  });

  describe('task template delete', () => {
    it('deletes a task template', async () => {
      const taskTemplate = await TaskTemplate.create({
        title: 'Housing',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const mutation = `mutation {
        taskTemplateDelete(input: { taskTemplateId: "${taskTemplate.id}" }) {
          title, deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.taskTemplateDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('task templates', () => {
    it('returns task templates', async () => {
      const taskTemplate1 = await TaskTemplate.create({
        title: 'Housing 1',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const taskTemplate2 = await TaskTemplate.create({
        title: 'Housing 2',
        repeating: false,
        goalSuggestionTemplateId: goalSuggestionTemplate.id,
        priority: 'low',
        careTeamAssigneeRole: 'physician',
      });
      const query = `{
        taskTemplates { title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.taskTemplates)).toMatchObject([
        {
          title: taskTemplate1.title,
        },
        {
          title: taskTemplate2.title,
        },
      ]);
    });
  });
});
