import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';

import { createMockAddress, createMockClinic, createMockUser } from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import User from '../user';

const userRole = 'Pharmacist' as UserRole;

interface ISetup {
  user: User;
  address: Address;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const address = await Address.create(createMockAddress(user.id), txn);

  return { user, address };
}

describe('address', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(Address.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  describe('get', async () => {
    it('should get address by id', async () => {
      const { address } = await setup(txn);
      const fetchedAddress = await Address.get(address.id, txn);
      expect(fetchedAddress).toMatchObject(address);
    });
  });

  describe('create', async () => {
    it('should create address', async () => {
      const { address, user } = await setup(txn);
      expect(address).toMatchObject({
        street1: '55 Washington St',
        zip: '11201',
        state: 'NY',
        city: 'Brooklyn',
        description: 'Office',
        updatedById: user.id,
      });
    });
  });

  describe('delete', async () => {
    it('should delete address', async () => {
      const { address } = await setup(txn);
      const deleted = await Address.delete(address.id, txn);

      expect(deleted.deletedAt).toBeTruthy();
      expect(deleted.id).toBe(address.id);

      await expect(Address.get(address.id, txn)).rejects.toMatch(`No such address: ${address.id}`);
    });
  });

  describe('edit', async () => {
    it('should edit address', async () => {
      const { address, user } = await setup(txn);
      const editedAddress = await Address.edit(
        {
          street1: '44 Washington St',
          zip: '10010',
          state: 'MA',
          city: 'Boston',
          description: "Sister's house",
          updatedById: user.id,
        },
        address.id,
        txn,
      );
      expect(editedAddress).toMatchObject({
        street1: '44 Washington St',
        zip: '10010',
        state: 'MA',
        city: 'Boston',
        description: "Sister's house",
        updatedById: user.id,
      });
    });
  });
});
