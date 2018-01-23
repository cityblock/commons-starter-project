import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createCbo, createCboCategory } from '../../spec-helpers';
import Cbo from '../cbo';
import CboCategory from '../cbo-category';

const input = {
  name: 'Red priestess healing',
  address: '3 Castle Road',
  city: 'Dragonstone',
  state: 'WS',
  zip: '33333',
  phone: '(333) 555-5555',
  url: 'www.gameofthrones.com',
};

interface ISetup {
  cboCategory: CboCategory;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const cboCategory = await createCboCategory(txn, 'Winter Protection');

  return { cboCategory };
}

describe('CBO model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a CBO', async () => {
    await transaction(Cbo.knex(), async txn => {
      const { cboCategory } = await setup(txn);
      const cbo = await Cbo.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );

      expect(cbo).toMatchObject({
        categoryId: cboCategory.id,
        ...input,
      });
      expect(await Cbo.get(cbo.id, txn)).toEqual(cbo);
    });
  });

  it('throws an error if CBO does not exist for a given id', async () => {
    await transaction(Cbo.knex(), async txn => {
      const fakeId = uuid();
      await expect(Cbo.get(fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
    });
  });

  it('gets all CBOs', async () => {
    await transaction(Cbo.knex(), async txn => {
      const { cboCategory } = await setup(txn);

      const name1 = 'Dragon fire heating';
      const name2 = 'Direwolf surgery';

      const cbo1 = await Cbo.create(
        {
          categoryId: cboCategory.id,
          ...input,
          name: name1,
        },
        txn,
      );
      const cbo2 = await createCbo(txn, name2);

      expect(await Cbo.getAll(txn)).toMatchObject([cbo2, cbo1]);
    });
  });

  it('edits a CBO', async () => {
    await transaction(Cbo.knex(), async txn => {
      const { cboCategory } = await setup(txn);

      const cbo = await Cbo.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );

      expect(cbo).toMatchObject({
        categoryId: cboCategory.id,
        ...input,
      });

      const name2 = 'Greyjoy water therapy';
      const address2 = 'Middle of ocean';

      const editedCbo = await Cbo.edit(
        {
          name: name2,
          address: address2,
        },
        cbo.id,
        txn,
      );

      expect(editedCbo).toMatchObject({
        name: name2,
        address: address2,
      });
    });
  });

  it('throws error when trying to edit with bogus id', async () => {
    await transaction(Cbo.knex(), async txn => {
      const fakeId = uuid();
      const name = "Arya's Meat Pie Pantry";

      await expect(Cbo.edit({ name }, fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
    });
  });

  it('deletes a CBO', async () => {
    await transaction(Cbo.knex(), async txn => {
      const { cboCategory } = await setup(txn);

      const cbo1 = await Cbo.create(
        {
          categoryId: cboCategory.id,
          ...input,
        },
        txn,
      );
      const cbo2 = await createCbo(txn);

      expect(cbo1.deletedAt).toBeFalsy();
      const deleted = await Cbo.delete(cbo1.id, txn);
      expect(deleted.deletedAt).toBeTruthy();

      expect(await Cbo.getAll(txn)).toMatchObject([cbo2]);
    });
  });

  it('throws error when trying to delete with bogus id', async () => {
    await transaction(Cbo.knex(), async txn => {
      const fakeId = uuid();
      await expect(Cbo.delete(fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
    });
  });
});
