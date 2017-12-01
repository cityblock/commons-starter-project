import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import schema from '../make-executable-schema';

describe('goal suggestion template resolver', () => {
  let db: Db;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve goal suggestion template', () => {
    it('fetches a goal suggestion template', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
        title: 'Fix housing',
      });
      const query = `{ goalSuggestionTemplate(
        goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
      ) { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionTemplate)).toMatchObject({
        title: 'Fix housing',
      });
    });
  });

  describe('goal suggestion template create', () => {
    it('creates a goal suggestion template', async () => {
      const mutation = `mutation {
        goalSuggestionTemplateCreate(input: { title: "Fix housing" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionTemplateCreate)).toMatchObject({
        title: 'Fix housing',
      });
    });
  });

  describe('goal suggestion template edit', () => {
    it('edits a goal suggestion template', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
        title: 'Fix housing',
      });
      const mutation = `mutation {
        goalSuggestionTemplateEdit(
          input: { title: "Medical", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}" }
        ) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionTemplateEdit)).toMatchObject({
        title: 'Medical',
      });
    });
  });

  describe('concernDelete', () => {
    it('deletes a goal suggestion template', async () => {
      const goalSuggestionTemplate = await GoalSuggestionTemplate.create({
        title: 'Fix housing',
      });
      const mutation = `mutation {
        goalSuggestionTemplateDelete(
          input: { goalSuggestionTemplateId: "${goalSuggestionTemplate.id}" }
        ) {
          title, deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.goalSuggestionTemplateDelete).deletedAt).not.toBeFalsy();
    });
  });

  describe('goal suggestion templates', () => {
    it('returns goal suggestion templates', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });
      const goalSuggestion2 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });

      const query = `{
        goalSuggestionTemplates { title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.goalSuggestionTemplates)).toMatchObject([
        {
          title: goalSuggestion2.title,
        },
        {
          title: goalSuggestion1.title,
        },
      ]);
    });

    it('returns goal suggestion templates with custom order', async () => {
      const goalSuggestion1 = await GoalSuggestionTemplate.create({
        title: 'fix Medical',
      });

      const goalSuggestion2 = await GoalSuggestionTemplate.create({
        title: 'fix Housing',
      });

      const query = `{
        goalSuggestionTemplates(orderBy: titleAsc) { title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });

      expect(cloneDeep(result.data!.goalSuggestionTemplates)).toMatchObject([
        {
          title: goalSuggestion2.title,
        },
        {
          title: goalSuggestion1.title,
        },
      ]);
    });
  });
});
