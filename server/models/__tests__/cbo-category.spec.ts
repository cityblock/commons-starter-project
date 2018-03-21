import { transaction } from 'objection';
import Db from '../../db';
import CBOCategory from '../cbo-category';

const title = 'Food Services';

describe('CBO category model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(CBOCategory.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets all CBO categories', async () => {
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

  it('creates a CBO category', async () => {
    const cboCategory = await CBOCategory.create(
      {
        title,
      },
      txn,
    );

    expect(cboCategory.title).toBe(title);
  });
});
