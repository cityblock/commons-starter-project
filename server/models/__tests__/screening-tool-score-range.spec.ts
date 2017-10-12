import Db from '../../db';
import { createMockPatient, createPatient } from '../../spec-helpers';
import Patient from '../patient';
import RiskArea from '../risk-area';
import ScreeningTool from '../screening-tool';
import ScreeningToolScoreRange from '../screening-tool-score-range';
import User from '../user';

describe('screening tool score range model', () => {
  let db: Db;
  let riskArea: RiskArea;
  let screeningTool: ScreeningTool;
  let screeningTool2: ScreeningTool;
  let patient: Patient;
  let user: User;

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
    user = await User.create({
      email: 'care@care.com',
      userRole: 'physician',
      homeClinicId: '1',
    });
    patient = await createPatient(createMockPatient(123), user.id);
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
    expect(scoreRange.screeningTool.id).toEqual(screeningTool.id);
    expect(await ScreeningToolScoreRange.get(scoreRange.id)).toMatchObject(scoreRange);
  });

  it('throws an error if a score range does not exist for a given id', async () => {
    const fakeId = 'fakeId';
    await expect(ScreeningToolScoreRange.get(fakeId)).rejects.toMatch(
      `No such screening tool score range: ${fakeId}`,
    );
  });

  it('edits a screening tool score range', async () => {
    const scoreRange = await ScreeningToolScoreRange.create({
      screeningToolId: screeningTool.id,
      description: 'Score Range',
      minimumScore: 0,
      maximumScore: 10,
    });

    const fetchedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
    expect(fetchedScoreRange.minimumScore).toEqual(0);

    await ScreeningToolScoreRange.edit(scoreRange.id, { minimumScore: 5 });
    const fetchedEditedScoreRange = await ScreeningToolScoreRange.get(scoreRange.id);
    expect(fetchedEditedScoreRange.minimumScore).toEqual(5);
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

  it('throws an error if a score range does not exist for a score and screening tool', async () => {
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

    await expect(
      ScreeningToolScoreRange.getByScoreForScreeningTool(21, screeningTool.id),
    ).rejects.toMatch(
      `No such screening tool score range for score: 21 and screeningToolId: ${screeningTool.id}`,
    );
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
