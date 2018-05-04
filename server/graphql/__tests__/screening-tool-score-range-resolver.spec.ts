import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction, Transaction } from 'objection';
import { RiskAdjustmentTypeOptions, UserRole } from 'schema';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import User from '../../models/user';
import { createMockClinic, createMockUser, createRiskArea } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  riskArea: RiskArea;
  screeningTool: ScreeningTool;
  screeningTool2: ScreeningTool;
  screeningToolScoreRange: ScreeningToolScoreRange;
  user: User;
  clinic: Clinic;
}

const userRole = 'admin' as UserRole;
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
  const screeningTool2 = await ScreeningTool.create(
    {
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    },
    txn,
  );
  const screeningToolScoreRange = await ScreeningToolScoreRange.create(
    {
      screeningToolId: screeningTool.id,
      description: 'Screening Tool Score Range',
      minimumScore: 0,
      maximumScore: 10,
    },
    txn,
  );

  return {
    clinic,
    user,
    riskArea,
    screeningTool,
    screeningTool2,
    screeningToolScoreRange,
  };
}

describe('screening tool score range resolver tests', () => {
  let txn = null as any;
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve screeningToolScoreRange', () => {
    it('can fetch a screeningToolScoreRange', async () => {
      const { screeningToolScoreRange, user } = await setup(txn);
      const query = `{
          screeningToolScoreRange(screeningToolScoreRangeId: "${screeningToolScoreRange.id}") {
            id
            description
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRange)).toMatchObject({
        id: screeningToolScoreRange.id,
        description: screeningToolScoreRange.description,
        minimumScore: 0,
        maximumScore: 10,
      });
    });

    it('errors if a screeningToolScoreRange cannot be found', async () => {
      const { user } = await setup(txn);
      const fakeId = uuid();
      const query = `{ screeningToolScoreRange(screeningToolScoreRangeId: "${fakeId}") { id } }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(result.errors![0].message).toMatch(`No such screening tool score range: ${fakeId}`);
    });

    it('gets all screeningToolScoreRanges', async () => {
      const { screeningTool, screeningToolScoreRange, user } = await setup(txn);
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create(
        {
          description: 'Screening Tool Score Range 2',
          screeningToolId: screeningTool.id,
          minimumScore: 11,
          maximumScore: 22,
        },
        txn,
      );

      const query = `{
          screeningToolScoreRanges {
            id
            description
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRanges)).toMatchObject([
        {
          id: screeningToolScoreRange.id,
          description: screeningToolScoreRange.description,
          minimumScore: 0,
          maximumScore: 10,
        },
        {
          id: screeningToolScoreRange2.id,
          description: screeningToolScoreRange2.description,
          minimumScore: 11,
          maximumScore: 22,
        },
      ]);
    });

    it('gets all screeningToolScoreRanges for a screeningTool', async () => {
      const { screeningTool, screeningTool2, screeningToolScoreRange, user } = await setup(txn);
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create(
        {
          description: 'Screening Tool Score Range 2',
          screeningToolId: screeningTool.id,
          minimumScore: 11,
          maximumScore: 20,
        },
        txn,
      );
      const screeningToolScoreRange3 = await ScreeningToolScoreRange.create(
        {
          description: 'Screening Tool Score Range 3',
          screeningToolId: screeningTool2.id,
          minimumScore: 0,
          maximumScore: 10,
        },
        txn,
      );
      const query = `{
          screeningToolScoreRangesForScreeningTool(screeningToolId: "${screeningTool.id}") {
            id
            description
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      const screeningToolScoreRanges = cloneDeep(
        result.data!.screeningToolScoreRangesForScreeningTool,
      );
      const scoreRangeIds = screeningToolScoreRanges.map((sr: ScreeningToolScoreRange) => sr.id);
      expect(screeningToolScoreRanges).toMatchObject([
        {
          id: screeningToolScoreRange.id,
          description: screeningToolScoreRange.description,
          minimumScore: 0,
          maximumScore: 10,
        },
        {
          id: screeningToolScoreRange2.id,
          description: screeningToolScoreRange2.description,
          minimumScore: 11,
          maximumScore: 20,
        },
      ]);
      expect(scoreRangeIds).not.toContain(screeningToolScoreRange3.id);
    });

    it('gets a screeningToolScoreRange for a score on a screeningTool', async () => {
      const { screeningTool, user } = await setup(txn);
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create(
        {
          description: 'Screening Tool Score Range 2',
          screeningToolId: screeningTool.id,
          minimumScore: 11,
          maximumScore: 20,
        },
        txn,
      );
      const query = `{
          screeningToolScoreRangeForScoreAndScreeningTool(
            screeningToolId: "${screeningTool.id}",
            score: 14
          ) {
            id
            description
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        userId: user.id,
        permissions,
        txn,
      });
      const resultScoreRange = cloneDeep(
        result.data!.screeningToolScoreRangeForScoreAndScreeningTool,
      );
      expect(resultScoreRange.id).toEqual(screeningToolScoreRange2.id);
      expect(resultScoreRange.minimumScore).toEqual(11);
      expect(resultScoreRange.maximumScore).toEqual(20);
    });
  });

  describe('screeningToolScoreRange edit', () => {
    it('edits a screeningToolScoreRange', async () => {
      const { screeningToolScoreRange, user } = await setup(txn);
      const query = `mutation {
          screeningToolScoreRangeEdit(input: {
            description: "Changed Description"
            screeningToolScoreRangeId: "${screeningToolScoreRange.id}"
          }) {
            description
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, query, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRangeEdit)).toMatchObject({
        description: 'Changed Description',
      });
    });
  });

  describe('screeningToolScoreRange create', () => {
    it('creates a new screeningToolScoreRange', async () => {
      const { screeningTool, user } = await setup(txn);
      const mutation = `mutation {
          screeningToolScoreRangeCreate(input: {
            screeningToolId: "${screeningTool.id}"
            description: "A Description"
            minimumScore: 50
            maximumScore: 100
            riskAdjustmentType: increment
          }) {
            description
            minimumScore
            maximumScore
            riskAdjustmentType
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRangeCreate)).toMatchObject({
        description: 'A Description',
        minimumScore: 50,
        maximumScore: 100,
        riskAdjustmentType: 'increment' as RiskAdjustmentTypeOptions,
      });
    });
  });

  describe('screeningToolScoreRange delete', () => {
    it('marks a screeningToolScoreRange as deleted', async () => {
      const { screeningToolScoreRange, user } = await setup(txn);
      const mutation = `mutation {
          screeningToolScoreRangeDelete(input: {
            screeningToolScoreRangeId: "${screeningToolScoreRange.id}"
          }) {
            id
            deletedAt
            minimumScore
            maximumScore
          }
        }`;
      const result = await graphql(schema, mutation, null, {
        db,
        permissions,
        userId: user.id,
        txn,
      });
      const deletedScoreRange = cloneDeep(result.data!.screeningToolScoreRangeDelete);
      expect(deletedScoreRange).toMatchObject({
        id: screeningToolScoreRange.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      expect(deletedScoreRange.deletedAt).not.toBeFalsy();
      expect(deletedScoreRange.deletedAt).not.toBeFalsy();
    });
  });
});
