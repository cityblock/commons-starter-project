import { graphql, print } from 'graphql';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import cboCategories from '../../../app/graphql/queries/get-cbo-categories.graphql';

import CBOCategory from '../../models/cbo-category';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import schema from '../make-executable-schema';

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green';

const setup = async (trx: Transaction) => {
  const clinic = await Clinic.create(createMockClinic(), trx);
  const user = await User.create(createMockUser(11, clinic.id, userRole), trx);

  return { user };
};

describe('CBO Category resolver', () => {
  let txn = null as any;
  const cboCategoriesQuery = print(cboCategories);

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('gets all CBO categories', async () => {
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

    const result = await graphql(schema, cboCategoriesQuery, null, {
      permissions,
      userId: user.id,
      testTransaction: txn,
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
