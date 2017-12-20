import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import ComputedField from '../../models/computed-field';
import Question from '../../models/question';
import { createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('computed field resolver', () => {
  let db: Db;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve computed field', () => {
    it('fetches a computed field', async () => {
      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });
      const query = `{ computedField(computedFieldId: "${computedField.id}") { label } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.computedField)).toMatchObject({
        label: 'Computed Field',
      });
    });
  });

  describe('resolve computed fields', () => {
    it('returns computed fields', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      const computedField2 = await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'boolean',
      });

      const query = `{
        computedFields { label }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.computedFields)).toMatchObject([
        {
          label: computedField2.label,
        },
        {
          label: computedField1.label,
        },
      ]);
    });

    it('returns computed fields in a custom order', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      const computedField2 = await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'boolean',
      });

      const query = `{
        computedFields(orderBy: labelDesc) { label }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
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

    it('returns only computed fields that are not associated with a question', async () => {
      const computedField1 = await ComputedField.create({
        label: 'def',
        slug: 'computed-field-1',
        dataType: 'boolean',
      });
      const computedField2 = await ComputedField.create({
        label: 'abc',
        slug: 'computed-field-2',
        dataType: 'boolean',
      });

      const riskArea = await createRiskArea({ title: 'Risk Area' });
      await Question.create({
        riskAreaId: riskArea.id,
        type: 'riskArea',
        order: 1,
        title: 'Question',
        answerType: 'boolean' as any,
        computedFieldId: computedField1.id,
      });

      const query = `{
        computedFields(availableOnly: true) { label }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.computedFields)).toMatchObject([
        { label: computedField2.label },
      ]);
    });
  });

  describe('computed field create', () => {
    it('creates a computed field with an auto-generated slug', async () => {
      const mutation = `mutation {
        computedFieldCreate(input: { label: "Computed Field", dataType: boolean }) {
          label
          slug
          dataType
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.computedFieldCreate)).toMatchObject({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });
    });
  });

  describe('computed field delete', () => {
    it('deletes a computed field', async () => {
      const computedField = await ComputedField.create({
        label: 'Computed Field',
        slug: 'computed-field',
        dataType: 'boolean',
      });
      const mutation = `mutation {
        computedFieldDelete(input: { computedFieldId: "${computedField.id}" }) {
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.computedFieldDelete).deletedAt).not.toBeFalsy();
    });
  });
});
