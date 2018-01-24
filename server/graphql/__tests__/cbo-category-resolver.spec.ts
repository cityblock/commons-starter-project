import { graphql } from 'graphql';
import { transaction, Transaction } from 'objection';
import Db from '../../db';
import CBOCategory from '../../models/cbo-category';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'admin';

const setup = async (txn: Transaction) => {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

  return { user };
};

describe('CBO Category resolver', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('gets all CBO categories', async () => {
    await transaction(CBOCategory.knex(), async txn => {
      const { user } = await setup(txn);
      const title1 = 'Baby Dragon Training';
      const title2 = 'Dragonglass Mining';

      const cboCategory1 = await CBOCategory.create(
        {
          title: title1,
        },
        txn,
      );
      const cboCategory2 = await CBOCategory.create(
        {
          title: title2,
        },
        txn,
      );

      const query = `{
        CBOCategories {
          id
          title
        }
      }`;

      const result = await graphql(schema, query, null, {
        userRole,
        userId: user.id,
        txn,
      });

      expect(result.data!.CBOCategories[0]).toMatchObject({
        id: cboCategory1.id,
        title: cboCategory1.title,
      });
      expect(result.data!.CBOCategories[1]).toMatchObject({
        id: cboCategory2.id,
        title: cboCategory2.title,
      });
    });
  });
});
