import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Concern from '../../models/concern';
import schema from '../make-executable-schema';

describe('concern resolver', () => {
  let db: Db;
  const userRole = 'admin';

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve concern', () => {
    it('fetches a concern', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      const query = `{ concern(concernId: "${concern.id}") { title } }`;
      const result = await graphql(schema, query, null, { userRole });
      expect(cloneDeep(result.data!.concern)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('concern create', () => {
    it('creates a concern', async () => {
      const mutation = `mutation {
        concernCreate(input: { title: "Housing" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernCreate)).toMatchObject({
        title: 'Housing',
      });
    });
  });

  describe('concern edit', () => {
    it('edits a concern', async () => {
      const concern = await Concern.create({ title: 'housing' });
      const mutation = `mutation {
        concernEdit(input: { title: "Medical", concernId: "${concern.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernEdit)).toMatchObject({
        title: 'Medical',
      });
    });
  });

  describe('concern delete', () => {
    it('deletes a concern', async () => {
      const concern = await Concern.create({ title: 'housing' });
      const mutation = `mutation {
        concernDelete(input: { concernId: "${concern.id}" }) {
          title, deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, { userRole });
      expect(cloneDeep(result.data!.concernDelete).deletedAt).not.toBeNull();
    });
  });

  describe('concerns', () => {
    it('returns concerns', async () => {
      const concern1 = await Concern.create({ title: 'housing' });
      const concern2 = await Concern.create({ title: 'medical' });

      const query = `{
        concerns { title }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole: 'admin',
      });
      expect(cloneDeep(result.data!.concerns)).toMatchObject([
        {
          title: concern1.title,
        },
        {
          title: concern2.title,
        },
      ]);
    });
  });
});
