import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

import { createMockClinic, createMockEmail, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import Email from '../email';
import User from '../user';

const userRole = 'Pharmacist' as UserRole;

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
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Email.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', async () => {
    it('should get email by id', async () => {
      const { email } = await setup(txn);
      const fetchedEmail = await Email.get(email.id, txn);
      expect(fetchedEmail).toMatchObject(email);
    });
  });

  describe('create', async () => {
    it('should create email', async () => {
      const { email, user } = await setup(txn);
      expect(email).toMatchObject({
        emailAddress: 'spam@email.com',
        description: 'spam email',
        updatedById: user.id,
      });
    });
  });

  describe('delete', async () => {
    it('should delete email', async () => {
      const { email } = await setup(txn);
      const deleted = await Email.delete(email.id, txn);

      expect(deleted.deletedAt).toBeTruthy();
      expect(deleted.id).toBe(email.id);

      await expect(Email.get(email.id, txn)).rejects.toMatch(`No such email: ${email.id}`);
    });
  });

  describe('edit', async () => {
    it('should edit email', async () => {
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
