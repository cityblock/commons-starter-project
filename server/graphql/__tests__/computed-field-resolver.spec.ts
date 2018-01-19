import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
import Db from '../../db';
import ComputedField from '../../models/computed-field';
import schema from '../make-executable-schema';

const userRole = 'admin';

describe('computed field resolver', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve computed field', () => {
    it('fetches a computed field', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );
        const query = `{ computedField(computedFieldId: "${computedField.id}") { label } }`;
        const result = await graphql(schema, query, null, { userRole, txn });
        expect(cloneDeep(result.data!.computedField)).toMatchObject({
          label: 'Computed Field',
        });
      });
    });
  });

  describe('resolve computed fields', () => {
    it('returns computed fields', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField1 = await ComputedField.create(
          {
            label: 'def',
            slug: 'computed-field-1',
            dataType: 'boolean',
          },
          txn,
        );
        const computedField2 = await ComputedField.create(
          {
            label: 'abc',
            slug: 'computed-field-2',
            dataType: 'boolean',
          },
          txn,
        );

        const query = `{
          computedFields { label }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });
        const computedFields = cloneDeep(result.data!.computedFields);
        const labels = computedFields.map((computedField: ComputedField) => computedField.label);

        expect(computedFields.length).toEqual(2);
        expect(labels).toContain(computedField1.label);
        expect(labels).toContain(computedField2.label);
      });
    });

    it('returns computed fields in a custom order', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField1 = await ComputedField.create(
          {
            label: 'def',
            slug: 'computed-field-1',
            dataType: 'boolean',
          },
          txn,
        );
        const computedField2 = await ComputedField.create(
          {
            label: 'abc',
            slug: 'computed-field-2',
            dataType: 'boolean',
          },
          txn,
        );

        const query = `{
          computedFields(orderBy: labelDesc) { label }
        }`;

        const result = await graphql(schema, query, null, {
          db,
          userRole: 'admin',
          txn,
        });
        expect(cloneDeep(result.data!.computedFields)).toMatchObject([
          {
            label: computedField1.label,
          },
          {
            label: computedField2.label,
          },
        ]);
      });
    });
  });

  describe('computed field create', () => {
    it('creates a computed field with an auto-generated slug', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const mutation = `mutation {
          computedFieldCreate(input: { label: "Computed Field", dataType: boolean }) {
            label
            slug
            dataType
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.computedFieldCreate)).toMatchObject({
          label: 'Computed Field',
          slug: 'computed-field',
          dataType: 'boolean',
        });
      });
    });
  });

  describe('computed field delete', () => {
    it('deletes a computed field', async () => {
      await transaction(ComputedField.knex(), async txn => {
        const computedField = await ComputedField.create(
          {
            label: 'Computed Field',
            slug: 'computed-field',
            dataType: 'boolean',
          },
          txn,
        );
        const mutation = `mutation {
          computedFieldDelete(input: { computedFieldId: "${computedField.id}" }) {
            deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, { userRole, txn });
        expect(cloneDeep(result.data!.computedFieldDelete).deletedAt).not.toBeFalsy();
      });
    });
  });
});
