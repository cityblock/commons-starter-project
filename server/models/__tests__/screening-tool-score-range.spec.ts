import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import Patient from '../patient';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

const userRole = 'physician';

describe('screening tool score range model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let screeningTool2: ScreeningTool;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();

    riskArea = await RiskArea.create({ title: 'Housing', order: 1 });
    screeningTool = await ScreeningTool.create({
      title: 'Screening Tool',
      riskAreaId: riskArea.id,
    });
    screeningTool2 = await ScreeningTool.create({
      title: 'Screening Tool 2',
      riskAreaId: riskArea.id,
    });
    clinic = await Clinic.create(createMockClinic());
    user = await User.create(createMockUser(11, clinic.id, userRole));
    patient = await createPatient(createMockPatient(123, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a screening tool score range with associations', async () => {
    const scoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });

    expect(scoreRange.description).toEqual('Score Range');
    expect(scoreRange.range).toEqual('[0,11)'); // Postgres representation of a range
    expect(scoreRange.screeningTool.id).toEqual(screeningTool.id);
    expect(await ScreeningToolScoreRange.get(scoreRange.id)).toMatchObject(scoreRange);
  });

  it('throws an error if a score range does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(ScreeningToolScoreRange.get(fakeId)).rejects.toMatch(
      `No such screening tool score range: ${fakeId}`,
    );
  });

  it('does not allow creation of a score range with an overlapping min/max', async () => {
    await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });
    const validSecondScoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Valid Second Score Range',
      minimumScore: 11,
      maximumScore: 20,
    });
    const anotherValidScoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool2.id,
      description: 'Second Valid Score Range',
      minimumScore: 15,
      maximumScore: 25,
    });

    // This score range does not overlap, so creation should have been successful
    expect(validSecondScoreRange.description).toEqual('Valid Second Score Range');

    // This score range does overlap, but for a different screeningTool so should be fine
    expect(anotherValidScoreRange.description).toEqual('Second Valid Score Range');

    try {
      // This overlaps and should throw an error
      await ScreeningToolScoreRange.create({
        screeningToolId: screeningTool.id,
        description: 'Invalid Score Range',
        minimumScore: 15,
        maximumScore: 25,
      });
    } catch (err) {
      expect(err.message).toMatch(
        'conflicting key value violates exclusion constraint "screening_tool_score_range_range"',
      );
    }

    // Now we delete the overlapping score range
    await ScreeningToolScoreRange.delete(validSecondScoreRange.id);

    const nowValidScoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: '(No Longer) Invalid Score Range',
      minimumScore: 15,
      maximumScore: 25,
    });

    // All should be well now
    expect(nowValidScoreRange.description).toEqual('(No Longer) Invalid Score Range');
  });

  it('edits a screening tool score range', async () => {
    const scoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });

    const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
    expect(fetchedScoreRange.description).toEqual('Score Range');
    // Sanity check on ranges
    expect(fetchedScoreRange.range).toEqual('[0,11)');

    await ScreeningToolScoreRange.edit(scoreRange.id, { description: 'Hello' });
    const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
    expect(fetchedEditedScoreRange.description).toEqual('Hello');
    expect(fetchedEditedScoreRange.range).toEqual('[0,11)');
  });

  describe('editing a screening tool score range min/max score', () => {
    it('works when both new minimum and maximum scores are entered', async () => {
      const scoreRange = await ScreeningToolScoreRange.create({
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      });

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedScoreRange.range).toEqual('[0,11)');

      await ScreeningToolScoreRange.edit(scoreRange.id, { minimumScore: 20, maximumScore: 25 });
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedEditedScoreRange.range).toEqual('[20,26)');
    });

    it('works when only a new minimum score is entered', async () => {
      const scoreRange = await ScreeningToolScoreRange.create({
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 5,
        maximumScore: 10,
      });

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedScoreRange.range).toEqual('[5,11)');

      await ScreeningToolScoreRange.edit(scoreRange.id, { minimumScore: 0 });
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedEditedScoreRange.range).toEqual('[0,11)');
    });

    it('works when only a new maximum score is entered', async () => {
      const scoreRange = await ScreeningToolScoreRange.create({
        screeningToolId: screeningTool.id,
        description: 'Score Range',
        minimumScore: 0,
        maximumScore: 10,
      });

      const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedScoreRange.range).toEqual('[0,11)');

      await ScreeningToolScoreRange.edit(scoreRange.id, { maximumScore: 8 });
      const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
      expect(fetchedEditedScoreRange.range).toEqual('[0,9)');
    });
  });

  it('gets all score ranges for a screening tool', async () => {
    const scoreRange1 = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 1',
      minimumScore: 0,
      maximumScore: 10,
    });
    const scoreRange2 = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 2',
      minimumScore: 11,
      maximumScore: 20,
    });
    const scoreRange3 = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool2.id,
      description: 'Score Range 3',
      minimumScore: 0,
      maximumScore: 10,
    });

    const scoreRanges = await ScreeningToolScoreRange.getForScreeningTool(screeningTool.id);
    const scoreRangeIds = scoreRanges.map(scoreRange => scoreRange.id);
    expect(scoreRanges.length).toEqual(2);
    expect(scoreRanges).toMatchObject([scoreRange1, scoreRange2]);
    expect(scoreRangeIds).not.toContain(scoreRange3.id);
  });

  it('gets a score range by score and screening tool', async () => {
    const scoreRange1 = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 1',
      minimumScore: 0,
      maximumScore: 10,
    });
    await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 2',
      minimumScore: 11,
      maximumScore: 20,
    });

    const fetchedScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      5,
      screeningTool.id,
    );
    expect(fetchedScoreRange).toMatchObject(scoreRange1);
  });

  it('returns null if a score range does not exist for a score and screening tool', async () => {
    await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 1',
      minimumScore: 0,
      maximumScore: 10,
    });
    await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range 2',
      minimumScore: 11,
      maximumScore: 20,
    });

    const screeningToolScoreRange = await ScreeningToolScoreRange.getByScoreForScreeningTool(
      21,
      screeningTool.id,
    );

    expect(screeningToolScoreRange).toBeNull();
  });

  it('deletes a screening tool score range', async () => {
    const scoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });

    const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
    expect(fetchedScoreRange.deletedAt).toBeNull();

    await ScreeningToolScoreRange.delete(scoreRange.id);

    await expect(ScreeningToolScoreRange.get(scoreRange.id)).rejects.toMatch(
      `No such screening tool score range: ${scoreRange.id}`,
    );
  });
});
