import * as uuid from 'uuid/v4';
import Db from '../../db';
import Concern from '../concern';

describe('concern model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('concern methods', () => {
    it('creates and retrieves a concern', async () => {
      const concern = await Concern.create({ title: 'Housing' });
      const concernById = await Concern.get(concern.id);

      expect(concernById).toMatchObject(concern);
    });

    it('throws an error when getting a concern by an invalid id', async () => {
      const fakeId = uuid();
      await expect(Concern.get(fakeId)).rejects.toMatch(`No such concern: ${fakeId}`);
    });

    it('edits concern', async () => {
      const concern = await Concern.create({
        title: 'Housing',
      });
      const concernUpdated = await Concern.edit(concern.id, {
        title: 'Medical',
      });
      expect(concernUpdated.title).toEqual('Medical');
    });

    it('deleted concern', async () => {
      const concern = await Concern.create({
        title: 'Housing',
      });
      expect(concern.deletedAt).toBeFalsy();
      const deleted = await Concern.delete(concern.id);
      expect(deleted.deletedAt).not.toBeFalsy();
    });

    it('fetches all concerns', async () => {
      const concern1 = await Concern.create({ title: 'Housing' });
      const concern2 = await Concern.create({ title: 'Medical' });

      expect(await Concern.getAll()).toMatchObject([concern1, concern2]);
    });

    it('finds or creates a concern by title', async () => {
      const concern = await Concern.create({ title: 'housing' });
      const foundOrCreatedConcern = await Concern.findOrCreateByTitle('Housing');
      const fetchedConcerns = await Concern.getAll();

      expect(fetchedConcerns.length).toEqual(1);
      expect(foundOrCreatedConcern).toMatchObject(concern);
    });
  });
});
