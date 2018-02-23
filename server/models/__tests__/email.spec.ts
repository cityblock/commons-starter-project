import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockClinic, createMockEmail, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Email from '../email';
import User from '../user';

const userRole = 'admin';

interface ISetup {
  user: User;
  email: Email;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const email = await Email.create(createMockEmail(user.id), txn);

  return { user, email };
}

describe('email', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create email', async () => {
      await transaction(Email.knex(), async txn => {
        const { email, user } = await setup(txn);
        expect(email).toMatchObject({
          emailAddress: 'spam@email.com',
          description: 'spam email',
          updatedById: user.id,
        });
      });
    });
  });

  describe('edit', async () => {
    it('should edit email', async () => {
      await transaction(Email.knex(), async txn => {
        const { email, user } = await setup(txn);
        const editedEmail = await Email.edit(
          {
            emailAddress: 'new@email.edu',
            description: 'new',
            updatedById: user.id,
          },
          email.id,
          txn,
        );
        expect(editedEmail).toMatchObject({
          emailAddress: 'new@email.edu',
          description: 'new',
          updatedById: user.id,
        });
      });
    });
  });
});
