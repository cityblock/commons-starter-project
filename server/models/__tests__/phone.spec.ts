import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockPhone, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Phone from '../phone';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  user: User;
  phone: Phone;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const phone = await Phone.create(createMockPhone(user.id), txn);

  return { user, phone };
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
        type: 'home',
        description: 'moms home phone',
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

  describe('edit', async () => {
    it('should edit phone', async () => {
      const { phone } = await setup(txn);
      const editedPhone = await Phone.edit(
        {
          phoneNumber: '555-555-5555',
          type: 'work',
          description: 'bank job',
        },
        phone.id,
        txn,
      );
      expect(editedPhone).toMatchObject({
        phoneNumber: '+15555555555',
        type: 'work',
        description: 'bank job',
      });
    });
  });
});
