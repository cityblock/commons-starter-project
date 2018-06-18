import { transaction, Transaction } from 'objection';
import uuid from 'uuid/v4';

import { createCBO, createCBOCategory } from '../../spec-helpers';
import CBO from '../cbo';
import CBOCategory from '../cbo-category';

const name1 = 'Dragon fire heating';
const name2 = 'Direwolf surgery';
const name3 = 'Winter coat provision';

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
  cboCategory: CBOCategory;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const cboCategory = await createCBOCategory(txn, 'Winter Protection');

  return { cboCategory };
}

describe('CBO model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(CBO.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and gets a CBO', async () => {
    const { cboCategory } = await setup(txn);
    const cbo = await CBO.create(
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
    expect(await CBO.get(cbo.id, txn)).toEqual(cbo);
  });

  it('throws an error if CBO does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(CBO.get(fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
  });

  it('gets all CBOs', async () => {
    const { cboCategory } = await setup(txn);
    const cbo1 = await CBO.create(
      {
        categoryId: cboCategory.id,
        ...input,
        name: name1,
      },
      txn,
    );
    const cbo2 = await createCBO(txn, name2);

    expect(await CBO.getAll(txn)).toMatchObject([cbo2, cbo1]);
  });

  it('gets all CBOs for a given category', async () => {
    const { cboCategory } = await setup(txn);
    const cboCategory2 = await createCBOCategory(txn);

    const cbo1 = await CBO.create(
      {
        categoryId: cboCategory.id,
        ...input,
        name: name1,
      },
      txn,
    );
    await CBO.create(
      {
        categoryId: cboCategory2.id,
        ...input,
        name: name2,
      },
      txn,
    );
    const cbo3 = await CBO.create(
      {
        categoryId: cboCategory.id,
        ...input,
        name: name3,
      },
      txn,
    );

    expect(await CBO.getForCategory(cboCategory.id, txn)).toMatchObject([cbo1, cbo3]);
  });

  it('edits a CBO', async () => {
    const { cboCategory } = await setup(txn);

    const cbo = await CBO.create(
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

    const address2 = 'Middle of ocean';

    const editedCBO = await CBO.edit(
      {
        name: name2,
        address: address2,
      },
      cbo.id,
      txn,
    );

    expect(editedCBO).toMatchObject({
      name: name2,
      address: address2,
    });
  });

  it('throws error when trying to edit with bogus id', async () => {
    const fakeId = uuid();
    const name = "Arya's Meat Pie Pantry";

    await expect(CBO.edit({ name }, fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
  });

  it('deletes a CBO', async () => {
    const { cboCategory } = await setup(txn);

    const cbo1 = await CBO.create(
      {
        categoryId: cboCategory.id,
        ...input,
      },
      txn,
    );
    const cbo2 = await createCBO(txn);

    expect(cbo1.deletedAt).toBeFalsy();
    const deleted = await CBO.delete(cbo1.id, txn);
    expect(deleted.deletedAt).toBeTruthy();

    expect(await CBO.getAll(txn)).toMatchObject([cbo2]);
  });

  it('throws error when trying to delete with bogus id', async () => {
    const fakeId = uuid();
    await expect(CBO.delete(fakeId, txn)).rejects.toMatch(`No such CBO: ${fakeId}`);
  });
});
