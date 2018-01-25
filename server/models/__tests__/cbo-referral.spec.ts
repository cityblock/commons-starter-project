import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { createCBO, createCBOReferral } from '../../spec-helpers';
import CBO from '../cbo';
import CBOReferral from '../cbo-referral';

const diagnosis = 'Winter is coming';
const sentAt = '2018-01-11T05:00:00.000Z';

interface ISetup {
  cbo: CBO;
}

const setup = async (txn: Transaction): Promise<ISetup> => {
  const cbo = await createCBO(txn);

  return { cbo };
};

describe('CBO referral model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('creates and gets a CBO referral', async () => {
    await transaction(CBOReferral.knex(), async txn => {
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
  });

  it('throws an error if CBO referral does not exist for a given id', async () => {
    await transaction(CBOReferral.knex(), async txn => {
      const fakeId = uuid();
      await expect(CBOReferral.get(fakeId, txn)).rejects.toMatch(`No such CBO referral: ${fakeId}`);
    });
  });

  it('edits a CBO referral', async () => {
    await transaction(CBOReferral.knex(), async txn => {
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
  });

  it('throws error when trying to edit with bogus id', async () => {
    await transaction(CBOReferral.knex(), async txn => {
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
  });

  it('deletes a CBO referral', async () => {
    await transaction(CBOReferral.knex(), async txn => {
      const cboReferral = await createCBOReferral(txn);
      expect(cboReferral.deletedAt).toBeFalsy();

      const deleted = await CBOReferral.delete(cboReferral.id, txn);
      expect(deleted.deletedAt).toBeTruthy();
    });
  });

  it('throws error when trying to delete with bogus id', async () => {
    await transaction(CBOReferral.knex(), async txn => {
      const fakeId = uuid();
      await expect(CBOReferral.delete(fakeId, txn)).rejects.toMatch(
        `No such CBO referral: ${fakeId}`,
      );
    });
  });
});
