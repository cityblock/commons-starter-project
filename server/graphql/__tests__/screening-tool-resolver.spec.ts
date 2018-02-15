import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  riskArea: RiskArea;
  screeningTool: ScreeningTool;
  user: User;
  clinic: Clinic;
}

const userRole = 'admin';
const permissions = 'green';

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const riskArea = await createRiskArea({ title: 'Risk Area' }, txn);
  const screeningTool = await ScreeningTool.create(
    {
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    },
    txn,
  );

  return {
    clinic,
    user,
    riskArea,
    screeningTool,
  };
}

describe('screening tool resolver tests', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve screeningTool', () => {
    it('can fetch a screeningTool', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { screeningTool, user } = await setup(txn);
        const query = `{
          screeningTool(screeningToolId: "${screeningTool.id}") {
            id
            title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.screeningTool)).toMatchObject({
          id: screeningTool.id,
          title: screeningTool.title,
        });
      });
    });

    it('errors if a screeningTool cannot be found', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { user } = await setup(txn);
        const fakeId = uuid();
        const query = `{ screeningTool(screeningToolId: "${fakeId}") { id } }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(result.errors![0].message).toMatch(`No such screening tool: ${fakeId}`);
      });
    });

    it('gets all screeningTools', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { riskArea, screeningTool, user } = await setup(txn);
        const screeningTool2 = await ScreeningTool.create(
          {
            title: 'Screening Tool 2',
            riskAreaId: riskArea.id,
          },
          txn,
        );

        const query = `{
          screeningTools {
            id
            title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        const screeningTools = cloneDeep(result.data!.screeningTools);
        const ids = screeningTools.map((tool: ScreeningTool) => tool.id);
        const titles = screeningTools.map((tool: ScreeningTool) => tool.title);

        expect(screeningTools.length).toEqual(2);
        expect(ids).toContain(screeningTool.id);
        expect(ids).toContain(screeningTool2.id);
        expect(titles).toContain(screeningTool.title);
        expect(titles).toContain(screeningTool2.title);
      });
    });

    it('gets all screeningTools for a riskArea', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { riskArea, screeningTool, user } = await setup(txn);
        const riskArea2 = await createRiskArea({ title: 'Risk Area 2', order: 2 }, txn);
        const screeningTool2 = await ScreeningTool.create(
          {
            title: 'Screening Tool 2',
            riskAreaId: riskArea.id,
          },
          txn,
        );
        const screeningTool3 = await ScreeningTool.create(
          {
            title: 'Screening Tool 3',
            riskAreaId: riskArea2.id,
          },
          txn,
        );

        const query = `{
          screeningToolsForRiskArea(riskAreaId: "${riskArea.id}") {
            id
            title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          userId: user.id,
          permissions,
          txn,
        });
        const screeningTools = cloneDeep(result.data!.screeningToolsForRiskArea);
        const screeningToolIds = screeningTools.map((st: ScreeningTool) => st.id);
        expect(screeningTools.length).toEqual(2);
        expect(screeningToolIds).toContain(screeningTool.id);
        expect(screeningToolIds).toContain(screeningTool2.id);
        expect(screeningToolIds).not.toContain(screeningTool3.id);
      });
    });
  });

  describe('screeningTool edit', () => {
    it('edits a screeningTool', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { screeningTool, user } = await setup(txn);
        const query = `mutation {
          screeningToolEdit(input: { title: "New Title", screeningToolId: "${screeningTool.id}" }) {
            title
          }
        }`;
        const result = await graphql(schema, query, null, {
          db,
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.screeningToolEdit)).toMatchObject({
          title: 'New Title',
        });
      });
    });
  });

  describe('screeningTool Create', () => {
    it('creates a new screeningTool', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { riskArea, user } = await setup(txn);
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
          permissions,
          userId: user.id,
          txn,
        });
        expect(cloneDeep(result.data!.screeningToolCreate)).toMatchObject({
          title: 'New Screening Tool',
        });
      });
    });
  });

  describe('screeningTool delete', () => {
    it('marks a screeningTool as deleted', async () => {
      await transaction(ScreeningTool.knex(), async txn => {
        const { screeningTool, user } = await setup(txn);
        const mutation = `mutation {
          screeningToolDelete(input: { screeningToolId: "${screeningTool.id}" }) {
            id
            deletedAt
          }
        }`;
        const result = await graphql(schema, mutation, null, {
          db,
          permissions,
          userId: user.id,
          txn,
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
});
