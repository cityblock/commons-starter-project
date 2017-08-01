import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import Question from '../../models/question';
import RiskArea from '../../models/risk-area';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('answer tests', () => {

  let db: Db = null as any;
  const userRole = 'admin';
  let riskArea: RiskArea = null as any;
  let question: Question = null as any;
  let user: User = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });

    riskArea = await RiskArea.create({
      title: 'testing',
      order: 1,
    });
    question = await Question.create({
      title: 'like writing tests?',
      answerType: 'dropdown',
      riskAreaId: riskArea.id,
      order: 1,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve riskArea', () => {
    it('can fetch riskArea', async () => {
      const query = `{
        riskArea(riskAreaId: "${riskArea.id}") {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.riskArea)).toMatchObject({
        id: riskArea.id,
        title: 'testing',
      });
    });

    it('errors if an riskArea cannot be found', async () => {
      const query = `{ riskArea(riskAreaId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(
        'No such risk area: fakeId',
      );
    });

    it('gets all risk areas', async () => {
      const query = `{
        riskArea(riskAreaId: "${riskArea.id}") {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.riskArea)).toMatchObject({
        id: riskArea.id,
        title: 'testing',
      });
    });
  });

  describe('riskArea edit', () => {
    it('edits riskArea', async () => {
      const query = `mutation {
        riskAreaEdit(input: { title: "new value", riskAreaId: "${riskArea.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.riskAreaEdit)).toMatchObject({
        title: 'new value',
      });
    });
  });

  describe('riskArea Create', () => {
    it('creates a new riskArea', async () => {
      const mutation = `mutation {
        riskAreaCreate(input: {
          title: "new risk area"
          order: 1
        }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.riskAreaCreate)).toMatchObject({
        title: 'new risk area',
      });
    });

  });

  describe('riskArea delete', () => {
    it('marks an riskArea as deleted', async () => {
      const mutation = `mutation {
        riskAreaDelete(input: { riskAreaId: "${riskArea.id}" }) {
          id,
        }
      }`;
      const result = await graphql(schema, mutation, null, { db, userRole, userId: user.id });
      expect(cloneDeep(result.data!.riskAreaDelete)).toMatchObject({
        id: riskArea.id,
      });
    });
  });
});
