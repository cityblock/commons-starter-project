import { transaction } from 'objection';
import Db from '../../db';
import CBOCategory from '../cbo-category';

const title = 'Food Services';

describe('CBO category model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets all CBO categories', async () => {
    await transaction(CBOCategory.knex(), async txn => {
      const title2 = 'Mental Health Services';
      const cboCategory = await CBOCategory.create(
        {
          title,
        },
        txn,
      );
      const cboCategory2 = await CBOCategory.create(
        {
          title: title2,
        },
        txn,
      );

      expect(await CBOCategory.getAll(txn)).toMatchObject([cboCategory, cboCategory2]);
    });
  });

  it('creates a CBO category', async () => {
    await transaction(CBOCategory.knex(), async txn => {
      const cboCategory = await CBOCategory.create(
        {
          title,
        },
        txn,
      );

      expect(cboCategory.title).toBe(title);
    });
  });
});
