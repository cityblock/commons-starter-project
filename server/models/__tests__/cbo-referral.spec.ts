import { transaction, Transaction } from 'objection';
import uuid from 'uuid/v4';

import { createCBO, createCBOReferral } from '../../spec-helpers';
import CBO from '../cbo';
import CBOReferral from '../cbo-referral';

const diagnosis = 'Winter is coming';
const sentAt = '2018-01-11T05:00:00.000Z';
const name = 'Arya Stark Pantry';

interface ISetup {
  cbo: CBO;
}

const setup = async (txn: Transaction): Promise<ISetup> => {
  const cbo = await createCBO(txn);

  return { cbo };
};

describe('CBO referral model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(CBOReferral.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('creates and gets a CBO referral', async () => {
    const { cbo } = await setup(txn);
    const cboReferral = await CBOReferral.create(
      {
        categoryId: cbo.categoryId,
        CBOId: cbo.id,
        diagnosis,
      },
      txn,
    );

    expect(cboReferral).toMatchObject({
      categoryId: cbo.categoryId,
      CBOId: cbo.id,
      diagnosis,
    });
    expect(await CBOReferral.get(cboReferral.id, txn)).toMatchObject(cboReferral);
  });

  it('creates and gets a CBO referral for other CBO', async () => {
    const { cbo } = await setup(txn);
    const url = 'https://www.westeros.com';

    const cboReferral = await CBOReferral.create(
      {
        categoryId: cbo.categoryId,
        name,
        url,
        diagnosis,
      },
      txn,
    );

    expect(cboReferral).toMatchObject({
      categoryId: cbo.categoryId,
      name,
      url,
      diagnosis,
    });
    expect(await CBOReferral.get(cboReferral.id, txn)).toMatchObject(cboReferral);
  });

  it('throws an error if trying to create CBO referral without enough information', async () => {
    const { cbo } = await setup(txn);
    const input = { name: CBOReferral.name, categoryId: cbo.categoryId };
    await expect(CBOReferral.create(input, txn)).rejects.toMatch(
      'Must select CBO from list or provide name and URL of other CBO',
    );
  });

  it('does not throw an error if skipping validation for CBO referral', async () => {
    const { cbo } = await setup(txn);
    const input = { name: CBOReferral.name, categoryId: cbo.categoryId };

    const cboReferral = await CBOReferral.create(input, txn, true);
    expect(cboReferral.name).toBe(CBOReferral.name);
    expect(cboReferral.CBOId).toBeNull();
    expect(cboReferral.url).toBeNull();
  });

  it('throws an error if CBO referral does not exist for a given id', async () => {
    const fakeId = uuid();
    await expect(CBOReferral.get(fakeId, txn)).rejects.toMatch(`No such CBO referral: ${fakeId}`);
  });

  it('edits a CBO referral', async () => {
    const cboReferral = await createCBOReferral(txn);
    expect(cboReferral.sentAt).toBeFalsy();

    const editedCBO = await CBOReferral.edit(
      {
        sentAt,
      },
      cboReferral.id,
      txn,
    );

    expect(editedCBO.sentAt).toBeTruthy();
  });

  it('throws error when trying to edit with bogus id', async () => {
    const fakeId = uuid();

    await expect(
      CBOReferral.edit(
        {
          sentAt,
        },
        fakeId,
        txn,
      ),
    ).rejects.toMatch(`No such CBO referral: ${fakeId}`);
  });

  it('deletes a CBO referral', async () => {
    const cboReferral = await createCBOReferral(txn);
    expect(cboReferral.deletedAt).toBeFalsy();

    const deleted = await CBOReferral.delete(cboReferral.id, txn);
    expect(deleted.deletedAt).toBeTruthy();
  });

  it('throws error when trying to delete with bogus id', async () => {
    const fakeId = uuid();
    await expect(CBOReferral.delete(fakeId, txn)).rejects.toMatch(
      `No such CBO referral: ${fakeId}`,
    );
  });
});
