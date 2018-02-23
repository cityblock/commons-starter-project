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
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create phone', async () => {
      await transaction(Phone.knex(), async txn => {
        const { phone, user } = await setup(txn);
        expect(phone).toMatchObject({
          phoneNumber: '123-456-7890',
          type: 'home',
          description: 'moms home phone',
          updatedById: user.id,
        });
      });
    });
  });

  describe('edit', async () => {
    it('should edit phone', async () => {
      await transaction(Phone.knex(), async txn => {
        const { phone, user } = await setup(txn);
        const editedPhone = await Phone.edit(
          {
            phoneNumber: '555-555-5555',
            type: 'work',
            description: 'bank job',
            updatedById: user.id,
          },
          phone.id,
          txn,
        );
        expect(editedPhone).toMatchObject({
          phoneNumber: '555-555-5555',
          type: 'work',
          description: 'bank job',
          updatedById: user.id,
        });
      });
    });
  });
});
