import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('screening tool resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    riskArea = await createRiskArea();
    screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve screeningTool', () => {
    it('can fetch a screeningTool', async () => {
      const query = `{
        screeningTool(screeningToolId: "${screeningTool.id}") {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.screeningTool)).toMatchObject({
        id: screeningTool.id,
        title: screeningTool.title,
      });
    });

    it('errors if a screeningTool cannot be found', async () => {
      const fakeId = uuid();
      const query = `{ screeningTool(screeningToolId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch(`No such screening tool: ${fakeId}`);
    });

    it('gets all screeningTools', async () => {
      const screeningTool2 = await ScreeningTool.create({
        title: 'Screening Tool 2',
        riskAreaId: riskArea.id,
      });

      const query = `{
        screeningTools {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.screeningTools)).toMatchObject([
        {
          id: screeningTool.id,
          title: screeningTool.title,
        },
        {
          id: screeningTool2.id,
          title: screeningTool2.title,
        },
      ]);
    });

    it('gets all screeningTools for a riskArea', async () => {
      const riskArea2 = await createRiskArea('Risk Area 2', 2);
      const screeningTool2 = await ScreeningTool.create({
        title: 'Screening Tool 2',
        riskAreaId: riskArea.id,
      });
      const screeningTool3 = await ScreeningTool.create({
        title: 'Screening Tool 3',
        riskAreaId: riskArea2.id,
      });

      const query = `{
        screeningToolsForRiskArea(riskAreaId: "${riskArea.id}") {
          id
          title
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      const screeningTools = cloneDeep(result.data!.screeningToolsForRiskArea);
      const screeningToolIds = screeningTools.map((st: ScreeningTool) => st.id);
      expect(screeningTools).toMatchObject([
        {
          id: screeningTool.id,
          title: screeningTool.title,
        },
        {
          id: screeningTool2.id,
          title: screeningTool2.title,
        },
      ]);
      expect(screeningToolIds).not.toContain(screeningTool3.id);
    });
  });

  describe('screeningTool edit', () => {
    it('edits a screeningTool', async () => {
      const query = `mutation {
        screeningToolEdit(input: { title: "New Title", screeningToolId: "${screeningTool.id}" }) {
          title
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.screeningToolEdit)).toMatchObject({
        title: 'New Title',
      });
    });
  });

  describe('screeningTool Create', () => {
    it('creates a new screeningTool', async () => {
      const mutation = `mutation {
        screeningToolCreate(input: {
          title: "New Screening Tool"
          riskAreaId: "${riskArea.id}"
        }) {
          title
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.screeningToolCreate)).toMatchObject({
        title: 'New Screening Tool',
      });
    });
  });

  describe('screeningTool delete', () => {
    it('marks a screeningTool as deleted', async () => {
      const mutation = `mutation {
        screeningToolDelete(input: { screeningToolId: "${screeningTool.id}" }) {
          id
          deletedAt
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      const deletedScreeningTool = cloneDeep(result.data!.screeningToolDelete);
      expect(deletedScreeningTool).toMatchObject({
        id: screeningTool.id,
      });
      expect(deletedScreeningTool.deletedAt).not.toBeFalsy();
      expect(deletedScreeningTool.deletedAt).not.toBeFalsy();
    });
  });
});
