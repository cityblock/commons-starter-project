import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockPhone } from '../../spec-helpers';
import Phone from '../phone';
import User from '../user';

interface ISetup {
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const phone = await Phone.create(createMockPhone(), txn);

  return { phone };
}

describe('phone', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', async () => {
    it('should get phone by id', async () => {
      const { phone } = await setup(txn);
      const fetchedPhone = await Phone.get(phone.id, txn);
      expect(fetchedPhone).toMatchObject(phone);
    });
  });

  describe('create', async () => {
    it('should create phone', async () => {
      const { phone } = await setup(txn);
      expect(phone).toMatchObject({
        phoneNumber: '+11234567890',
      });
    });

    it('should not create a phone with the same number', async () => {
      await setup(txn);

      try {
        await Phone.create(createMockPhone(), txn);
      } catch (err) {
        expect(err.constraint).toMatch('phone_number_unique');
      }
    });

    it('should create phone with same number if other phone deleted', async () => {
      const { phone } = await setup(txn);
      await Phone.delete(phone.id, txn);

      const newPhone = await Phone.create(createMockPhone(), txn);
      expect(newPhone).toMatchObject({
        phoneNumber: '+11234567890',
      });
    });
  });

  describe('delete', async () => {
    it('should delete phone', async () => {
      const { phone } = await setup(txn);
      const deleted = await Phone.delete(phone.id, txn);

      expect(deleted.deletedAt).toBeTruthy();
      expect(deleted.id).toBe(phone.id);

      await expect(Phone.get(phone.id, txn)).rejects.toMatch(`No such phone: ${phone.id}`);
    });
  });
});
