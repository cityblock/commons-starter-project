import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';

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

const userRole = 'Pharmacist' as UserRole;
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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('resolve screeningTool', () => {
    it('can fetch a screeningTool', async () => {
      const { screeningTool, user } = await setup(txn);
      const query = `{
          screeningTool(screeningToolId: "${screeningTool.id}") {
            id
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.screeningTool)).toMatchObject({
        id: screeningTool.id,
        title: screeningTool.title,
      });
    });

    it('errors if a screeningTool cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{ screeningTool(screeningToolId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(result.errors![0].message).toMatch(`No such screening tool: ${fakeId}`);
    });

    it('gets all screeningTools', async () => {
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
        userId: user.id,
        permissions,
        testTransaction: txn,
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

  describe('screeningTool edit', () => {
    it('edits a screeningTool', async () => {
      const { screeningTool, user } = await setup(txn);
      const query = `mutation {
          screeningToolEdit(input: { title: "New Title", screeningToolId: "${screeningTool.id}" }) {
            title
          }
        }`;
      const result = await graphql(schema, query, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.screeningToolEdit)).toMatchObject({
        title: 'New Title',
      });
    });
  });

  describe('screeningTool Create', () => {
    it('creates a new screeningTool', async () => {
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
        permissions,
        userId: user.id,
        testTransaction: txn,
      });
      expect(cloneDeep(result.data!.screeningToolCreate)).toMatchObject({
        title: 'New Screening Tool',
      });
    });
  });

  describe('screeningTool delete', () => {
    it('marks a screeningTool as deleted', async () => {
      const { screeningTool, user } = await setup(txn);
      const mutation = `mutation {
          screeningToolDelete(input: { screeningToolId: "${screeningTool.id}" }) {
            id
            deletedAt
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        permissions,
        userId: user.id,
        testTransaction: txn,
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
