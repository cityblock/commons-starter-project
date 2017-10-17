import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import Db from '../../db';
import RiskArea from '../../models/risk-area';
import ScreeningTool from '../../models/screening-tool';
import ScreeningToolScoreRange from '../../models/screening-tool-score-range';
import User from '../../models/user';
import schema from '../make-executable-schema';

describe('screening tool score range resolver tests', () => {
  let db: Db;
  const userRole = 'admin';
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let screeningTool2: ScreeningTool;
  let screeningToolScoreRange: ScreeningToolScoreRange;
  let user: User;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
    user = await User.create({ email: 'a@b.com', userRole, homeClinicId: '1' });
    riskArea = await RiskArea.create({
      title: 'Risk Area',
      order: 1,
    });
    screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
    screeningTool2 = await ScreeningTool.create({
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    });
    screeningToolScoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Screening Tool Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolve screeningToolScoreRange', () => {
    it('can fetch a screeningToolScoreRange', async () => {
      const query = `{
        screeningToolScoreRange(screeningToolScoreRangeId: "${screeningToolScoreRange.id}") {
          id
          description
          minimumScore
          maximumScore
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.screeningToolScoreRange)).toMatchObject({
        id: screeningToolScoreRange.id,
        description: screeningToolScoreRange.description,
        minimumScore: 0,
        maximumScore: 10,
      });
    });

    it('errors if a screeningToolScoreRange cannot be found', async () => {
      const query = `{ screeningToolScoreRange(screeningToolScoreRangeId: "fakeId") { id } }`;
      const result = await graphql(schema, query, null, { db, userRole });
      expect(result.errors![0].message).toMatch('No such screening tool score range: fakeId');
    });

    it('gets all screeningToolScoreRanges', async () => {
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create({
        description: 'Screening Tool Score Range 2',
        screeningToolId: screeningTool.id,
        minimumScore: 11,
        maximumScore: 22,
      });

      const query = `{
        screeningToolScoreRanges {
          id
          description
          minimumScore
          maximumScore
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
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
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create({
        description: 'Screening Tool Score Range 2',
        screeningToolId: screeningTool.id,
        minimumScore: 11,
        maximumScore: 20,
      });
      const screeningToolScoreRange3 = await ScreeningToolScoreRange.create({
        description: 'Screening Tool Score Range 3',
        screeningToolId: screeningTool2.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      const query = `{
        screeningToolScoreRangesForScreeningTool(screeningToolId: "${screeningTool.id}") {
          id
          description
          minimumScore
          maximumScore
        }
      }`;
      const result = await graphql(schema, query, null, { db, userRole });
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
      const screeningToolScoreRange2 = await ScreeningToolScoreRange.create({
        description: 'Screening Tool Score Range 2',
        screeningToolId: screeningTool.id,
        minimumScore: 11,
        maximumScore: 20,
      });
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
      const result = await graphql(schema, query, null, { db, userRole });
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
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRangeEdit)).toMatchObject({
        description: 'Changed Description',
      });
    });
  });

  describe('screeningToolScoreRange create', () => {
    it('creates a new screeningToolScoreRange', async () => {
      const mutation = `mutation {
        screeningToolScoreRangeCreate(input: {
          screeningToolId: "${screeningTool.id}"
          description: "A Description"
          minimumScore: 50
          maximumScore: 100
        }) {
          description
          minimumScore
          maximumScore
        }
      }`;
      const result = await graphql(schema, mutation, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.screeningToolScoreRangeCreate)).toMatchObject({
        description: 'A Description',
        minimumScore: 50,
        maximumScore: 100,
      });
    });
  });

  describe('screeningToolScoreRange delete', () => {
    it('marks a screeningToolScoreRange as deleted', async () => {
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
        userRole,
        userId: user.id,
      });
      const deletedScoreRange = cloneDeep(result.data!.screeningToolScoreRangeDelete);
      expect(deletedScoreRange).toMatchObject({
        id: screeningToolScoreRange.id,
        minimumScore: 0,
        maximumScore: 10,
      });
      expect(deletedScoreRange.deletedAt).not.toBeNull();
      expect(deletedScoreRange.deletedAt).not.toBeUndefined();
    });
  });
});
