import Db from '../../db';
import GoogleAuth from '../google-auth';
import User from '../user';

describe('google auth model', () => {
  let db: Db = null as any;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('should get and create', async () => {
    const user = await User.create({
      email: 'care@care.com',
      firstName: 'Dan',
      lastName: 'Plant',
      userRole: 'physician',
      homeClinicId: '1',
    });
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
    expect(await GoogleAuth.updateOrCreate({
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    })).toMatchObject({
      id: googleAuth.id,
      accessToken: 'accessToken',
      expiresAt: 'expires!',
      userId: user.id,
    });
  });
});
