import { transaction } from 'objection';
import { UserRole } from 'schema';

import { createMockClinic, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import GoogleAuth from '../google-auth';
import User from '../user';

describe('google auth model', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(GoogleAuth.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('should get and create', async () => {
    const clinic = await Clinic.create(createMockClinic(), txn);
    const user = await User.create(
      createMockUser(11, clinic.id, 'Primary_Care_Physician' as UserRole, 'care@care.com'),
      txn,
    );

    const googleAuth = await GoogleAuth.updateOrCreate(
      {
        accessToken: 'accessToken',
        expiresAt: 'expires!',
        userId: user.id,
      },
      txn,
    );
    expect(googleAuth).toMatchObject({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
    expect(
      await GoogleAuth.updateOrCreate(
        {
          accessToken: 'accessToken',
          expiresAt: 'expires!',
          userId: user.id,
        },
        txn,
      ),
    ).toMatchObject({
      id: googleAuth.id,
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
  });
});
