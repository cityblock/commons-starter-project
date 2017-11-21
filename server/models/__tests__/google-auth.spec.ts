import Db from '../../db';
import { createMockClinic, createMockUser } from '../../spec-helpers';
import Clinic from '../clinic';
import GoogleAuth from '../google-auth';
import User from '../user';

describe('google auth model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should get and create', async () => {
    const clinic = await Clinic.create(createMockClinic());
    const user = await User.create(createMockUser(11, clinic.id, 'physician', 'care@care.com'));

    const googleAuth = await GoogleAuth.updateOrCreate({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
    expect(googleAuth).toMatchObject({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
    expect(
      await GoogleAuth.updateOrCreate({
        accessToken: 'accessToken',
        expiresAt: 'expires!',
        userId: user.id,
      }),
    ).toMatchObject({
      id: googleAuth.id,
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
  });
});
