import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import Db from '../../db';
import GoalSuggestionTemplate from '../../models/goal-suggestion-template';
import schema from '../make-executable-schema';

const userRole = 'admin';

describe('goal suggestion template resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve goal suggestion template', () => {
    it('fetches a goal suggestion template', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
          {
            title: 'Fix housing',
          },
          txn,
        );
        const query = `{ goalSuggestionTemplate(
          goalSuggestionTemplateId: "${goalSuggestionTemplate.id}"
        ) { title } }`;
        const result = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result.data!.goalSuggestionTemplate)).toMatchObject({
          title: 'Fix housing',
        });
      });
    });
  });

  describe('goal suggestion template create', () => {
    it('creates a goal suggestion template', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const mutation = `mutation {
          goalSuggestionTemplateCreate(input: { title: "Fix housing" }) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.goalSuggestionTemplateCreate)).toMatchObject({
          title: 'Fix housing',
        });
      });
    });
  });

  describe('goal suggestion template edit', () => {
    it('edits a goal suggestion template', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
          {
            title: 'Fix housing',
          },
          txn,
        );
        const mutation = `mutation {
          goalSuggestionTemplateEdit(
            input: { title: "Medical", goalSuggestionTemplateId: "${goalSuggestionTemplate.id}" }
          ) {
            title
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.goalSuggestionTemplateEdit)).toMatchObject({
          title: 'Medical',
        });
      });
    });
  });

  describe('concernDelete', () => {
    it('deletes a goal suggestion template', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const goalSuggestionTemplate = await GoalSuggestionTemplate.create(
          {
            title: 'Fix housing',
          },
          txn,
        );
        const mutation = `mutation {
          goalSuggestionTemplateDelete(
            input: { goalSuggestionTemplateId: "${goalSuggestionTemplate.id}" }
          ) {
            title, deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.goalSuggestionTemplateDelete).deletedAt).not.toBeFalsy();
      });
    });
  });

  describe('goal suggestion templates', () => {
    it('returns goal suggestion templates', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const goalSuggestion1 = await GoalSuggestionTemplate.create(
          {
            title: 'fix Housing',
          },
          txn,
        );
        const goalSuggestion2 = await GoalSuggestionTemplate.create(
          {
            title: 'fix Medical',
          },
          txn,
        );

        const query = `{
          goalSuggestionTemplates { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });
        const goalSuggestionTemplates = cloneDeep(result.data!.goalSuggestionTemplates);
        const titles = goalSuggestionTemplates.map(
          (template: GoalSuggestionTemplate) => template.title,
        );

        expect(goalSuggestionTemplates.length).toEqual(2);
        expect(titles).toContain(goalSuggestion1.title);
        expect(titles).toContain(goalSuggestion2.title);
      });
    });

    it('returns goal suggestion templates with custom order', async () => {
      await transaction(GoalSuggestionTemplate.knex(), async txn => {
        const goalSuggestion1 = await GoalSuggestionTemplate.create(
          {
            title: 'fix Medical',
          },
          txn,
        );

        const goalSuggestion2 = await GoalSuggestionTemplate.create(
          {
            title: 'fix Housing',
          },
          txn,
        );

        const query = `{
          goalSuggestionTemplates(orderBy: titleAsc) { title }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
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
});
