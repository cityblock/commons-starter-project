import { transaction } from 'objection';
import Db from '../../db';
import CboCategory from '../cbo-category';

describe('CBO category model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates a CBO category', async () => {
    await transaction(CboCategory.knex(), async txn => {
      const title = 'Food Services';
      const cboCategory = await CboCategory.create(
        {
          title,
        },
        txn,
      );

      expect(cboCategory.title).toBe(title);
    });
  });
});
