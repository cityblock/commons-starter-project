import { transaction, Transaction } from 'objection';
import Db from '../../db';
import { createMockAddress, createMockClinic, createMockUser } from '../../spec-helpers';
import Address from '../address';
import Clinic from '../clinic';
import User from '../user';

const userRole = 'admin';

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
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('create', async () => {
    it('should create address', async () => {
      await transaction(Address.knex(), async txn => {
        const { address, user } = await setup(txn);
        expect(address).toMatchObject({
          street: '55 Washington St',
          zip: '11201',
          state: 'NY',
          city: 'Brooklyn',
          description: 'Office',
          updatedBy: user.id,
        });
      });
    });
  });

  describe('edit', async () => {
    it('should edit address', async () => {
      await transaction(Address.knex(), async txn => {
        const { address, user } = await setup(txn);
        const editedAddress = await Address.edit(
          {
            street: '44 Washington St',
            zip: '10010',
            state: 'MA',
            city: 'Boston',
            description: "Sister's house",
            updatedBy: user.id,
          },
          address.id,
          txn,
        );
        expect(editedAddress).toMatchObject({
          street: '44 Washington St',
          zip: '10010',
          state: 'MA',
          city: 'Boston',
          description: "Sister's house",
          updatedBy: user.id,
        });
      });
    });
  });
});
