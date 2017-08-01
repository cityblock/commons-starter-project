import Db from '../../db';
import RiskArea from '../risk-area';

describe('risk area model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should creates and get a risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.title).toEqual('Housing');
    expect(await RiskArea.get(riskArea.id)).toEqual(riskArea);
  });

  it('should throw an error if a risk area does not exist for the id', async () => {
    const fakeId = 'fakeId';
    await expect(RiskArea.get(fakeId))
      .rejects
      .toMatch('No such risk area: fakeId');
  });

  it('edits risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.title).toEqual('Housing');
    const editedRiskArea = await RiskArea.edit({ title: 'Mental Health' }, riskArea.id);
    expect(editedRiskArea.title).toEqual('Mental Health');
  });

  it('deleted risk area', async () => {
    const riskArea = await RiskArea.create({
      title: 'Housing',
      order: 1,
    });
    expect(riskArea.deletedAt).toBeNull();
    const deleted = await RiskArea.delete(riskArea.id);
    expect(deleted.deletedAt).not.toBeNull();
  });
});
