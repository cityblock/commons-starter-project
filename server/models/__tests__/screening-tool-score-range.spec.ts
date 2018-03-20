import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  createRiskArea,
} from '../../spec-helpers';
import Clinic from '../clinic';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

interface ISetup {
  riskArea: RiskArea;
  screeningTool: ScreeningTool;
  screeningTool2: ScreeningTool;
  user: User;
  clinic: Clinic;
}

const userRole = 'physician';

async function setup(txn: Transaction): Promise<ISetup> {
  const riskArea = await createRiskArea({ title: 'Housing' }, txn);
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
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    riskArea,
    screeningTool,
    screeningTool2,
    clinic,
    user,
  };
}

describe('screening tool score range model', () => {
  let txn = null as any;

  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a screening tool score range with associations', async () => {
    const { screeningTool } = await setup(txn);
    const scoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );

    expect(scoreRange.description).toEqual('Score Range');
    expect(scoreRange.range).toEqual('[0,11)'); // Postgres representation of a range
    expect(scoreRange.screeningTool.id).toEqual(screeningTool.id);
    expect(await ScreeningToolScoreRange.get(scoreRange.id, txn)).toMatchObject(scoreRange);
  });

  it('throws an error if a score range does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(ScreeningToolScoreRange.get(fakeId, txn)).rejects.toMatch(
      `No such screening tool score range: ${fakeId}`,
    );
  });

  it('does not allow creation of a score range with an overlapping min/max', async () => {
    let error: string = '';
    try {
      const { screeningTool, screeningTool2 } = await setup(txn);
      await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Score Range',
          minimumScore: 0,
          maximumScore: 10,
        },
        txn,
      );
      const validSecondScoreRange = await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Valid Second Score Range',
          minimumScore: 11,
          maximumScore: 20,
        },
        txn,
      );
      const anotherValidScoreRange = await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool2.id,
          description: 'Second Valid Score Range',
          minimumScore: 15,
          maximumScore: 25,
        },
        txn,
      );

      // This score range does not overlap, so creation should have been successful
      expect(validSecondScoreRange.description).toEqual('Valid Second Score Range');

      // This score range does overlap, but for a different screeningTool so should be fine
      expect(anotherValidScoreRange.description).toEqual('Second Valid Score Range');

      // This overlaps and should throw an error
      await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Invalid Score Range',
          minimumScore: 15,
          maximumScore: 25,
        },
        txn,
      );
    } catch (err) {
      error = err.message;
    }

    expect(error).toMatch(
      'conflicting key value violates exclusion constraint "screening_tool_score_range_range"',
    );
  });

  it('allows creation of a range with an overlapping min/max of a deleted range', async () => {
    const { screeningTool, screeningTool2 } = await setup(txn);
    await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );
    const validSecondScoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Valid Second Score Range',
        minimumScore: 11,
        maximumScore: 20,
      },
      txn,
    );
    const anotherValidScoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool2.id,
        description: 'Second Valid Score Range',
        minimumScore: 15,
        maximumScore: 25,
      },
      txn,
    );

    // This score range does not overlap, so creation should have been successful
    expect(validSecondScoreRange.description).toEqual('Valid Second Score Range');

    // This score range does overlap, but for a different screeningTool so should be fine
    expect(anotherValidScoreRange.description).toEqual('Second Valid Score Range');

    // Now we delete the overlapping score range
    await ScreeningToolScoreRange.delete(validSecondScoreRange.id, txn);
    const nowValidScoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Not Invalid Score Range',
        minimumScore: 15,
        maximumScore: 25,
      },
      txn,
    );

    // All should be well now
    expect(nowValidScoreRange.description).toEqual('Not Invalid Score Range');
  });

  it('edits a screening tool score range', async () => {
    const { screeningTool } = await setup(txn);
    const scoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );

    const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
    expect(fetchedScoreRange.description).toEqual('Score Range');
    // Sanity check on ranges
    expect(fetchedScoreRange.range).toEqual('[0,11)');

    await ScreeningToolScoreRange.edit(scoreRange.id, { description: 'Hello' }, txn);
    const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
    expect(fetchedEditedScoreRange.description).toEqual('Hello');
    expect(fetchedEditedScoreRange.range).toEqual('[0,11)');
  });

  describe('editing a screening tool score range min/max score', () => {
    it('works when both new minimum and maximum scores are entered', async () => {
      const { screeningTool } = await setup(txn);
      const scoreRange = await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Score Range',
          minimumScore: 0,
          maximumScore: 10,
        },
        txn,
      );

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedScoreRange.range).toEqual('[0,11)');

      await ScreeningToolScoreRange.edit(
        scoreRange.id,
        { minimumScore: 20, maximumScore: 25 },
        txn,
      );
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedEditedScoreRange.range).toEqual('[20,26)');
    });

    it('works when only a new minimum score is entered', async () => {
      const { screeningTool } = await setup(txn);
      const scoreRange = await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Score Range',
          minimumScore: 5,
          maximumScore: 10,
        },
        txn,
      );

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedScoreRange.range).toEqual('[5,11)');

      await ScreeningToolScoreRange.edit(scoreRange.id, { minimumScore: 0 }, txn);
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedEditedScoreRange.range).toEqual('[0,11)');
    });

    it('works when only a new maximum score is entered', async () => {
      const { screeningTool } = await setup(txn);
      const scoreRange = await ScreeningToolScoreRange.create(
        {
          screeningToolId: screeningTool.id,
          description: 'Score Range',
          minimumScore: 0,
          maximumScore: 10,
        },
        txn,
      );

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedScoreRange.range).toEqual('[0,11)');

      await ScreeningToolScoreRange.edit(scoreRange.id, { maximumScore: 8 }, txn);
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
      expect(fetchedEditedScoreRange.range).toEqual('[0,9)');
    });
  });

  it('gets all score ranges for a screening tool', async () => {
    const { screeningTool, screeningTool2 } = await setup(txn);
    const scoreRange1 = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 1',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );
    const scoreRange2 = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 2',
        minimumScore: 11,
        maximumScore: 20,
      },
      txn,
    );
    const scoreRange3 = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool2.id,
        description: 'Score Range 3',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );

    const scoreRanges = await ScreeningToolScoreRange.getForScreeningTool(screeningTool.id, txn);
    const scoreRangeIds = scoreRanges.map(scoreRange => scoreRange.id);
    expect(scoreRanges.length).toEqual(2);
    expect(scoreRanges).toMatchObject([scoreRange1, scoreRange2]);
    expect(scoreRangeIds).not.toContain(scoreRange3.id);
  });

  it('gets a score range by score and screening tool', async () => {
    const { screeningTool } = await setup(txn);
    const scoreRange1 = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 1',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );
    await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 2',
        minimumScore: 11,
        maximumScore: 20,
      },
      txn,
    );

    const fetchedScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      5,
      screeningTool.id,
      txn,
    );
    expect(fetchedScoreRange).toMatchObject(scoreRange1);
  });

  it('returns null if a score range does not exist for a score and screening tool', async () => {
    const { screeningTool } = await setup(txn);
    await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 1',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );
    await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range 2',
        minimumScore: 11,
        maximumScore: 20,
      },
      txn,
    );

    const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      21,
      screeningTool.id,
      txn,
    );

    expect(screeningToolScoreRange).toBeFalsy();
  });

  it('deletes a screening tool score range', async () => {
    const { screeningTool } = await setup(txn);
    const scoreRange = await ScreeningToolScoreRange.create(
      {
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      },
      txn,
    );

    const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id, txn);
    expect(fetchedScoreRange.deletedAt).toBeFalsy();

    await ScreeningToolScoreRange.delete(scoreRange.id, txn);

    await expect(ScreeningToolScoreRange.get(scoreRange.id, txn)).rejects.toMatch(
      `No such screening tool score range: ${scoreRange.id}`,
    );
  });
});
