import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Concern from '../concern';

const order = 'asc';
const orderBy = 'createdAt';

describe('concern model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('concern methods', () => {
    it('creates and retrieves a concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern = await Concern.create({ title: 'Housing' }, txn);
        const concernById = await Concern.get(concern.id, txn);

        expect(concernById).toMatchObject(concern);
      });
    });

    it('throws an error when getting a concern by an invalid id', async () => {
      await transaction(Concern.knex(), async txn => {
        const fakeId = uuid();
        await expect(Concern.get(fakeId, txn)).rejects.toMatch(`No such concern: ${fakeId}`);
      });
    });

    it('edits concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern = await Concern.create(
          {
            title: 'Housing',
          },
          txn,
        );
        const concernUpdated = await Concern.edit(
          concern.id,
          {
            title: 'Medical',
          },
          txn,
        );
        expect(concernUpdated.title).toEqual('Medical');
      });
    });

    it('deleted concern', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern = await Concern.create(
          {
            title: 'Housing',
          },
          txn,
        );
        expect(concern.deletedAt).toBeFalsy();
        const deleted = await Concern.delete(concern.id, txn);
        expect(deleted.deletedAt).not.toBeFalsy();
      });
    });

    it('fetches all concerns', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern1 = await Concern.create({ title: 'Housing' }, txn);
        const concern2 = await Concern.create({ title: 'Medical' }, txn);

        expect(await Concern.getAll({ orderBy, order }, txn)).toMatchObject([concern1, concern2]);
      });
    });

    it('fetches all concerns in a custom order', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern1 = await Concern.create({ title: 'def' }, txn);
        const concern2 = await Concern.create({ title: 'abc' }, txn);

        expect(await Concern.getAll({ orderBy: 'title', order: 'asc' }, txn)).toMatchObject([
          concern2,
          concern1,
        ]);
      });
    });

    it('finds or creates a concern by title', async () => {
      await transaction(Concern.knex(), async txn => {
        const concern = await Concern.create({ title: 'housing' }, txn);
        const foundOrCreatedConcern = await Concern.findOrCreateByTitle('Housing', txn);
        const fetchedConcerns = await Concern.getAll({ orderBy, order }, txn);

        expect(fetchedConcerns.length).toEqual(1);
        expect(foundOrCreatedConcern).toMatchObject(concern);
      });
    });
  });
});
