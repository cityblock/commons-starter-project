import Db from '../../db';
import User from '../../models/user';
import { getGraphQLContext, parseAndVerifyJwt, signJwt } from './../shared/utils';

describe('util tests', () => {
  let db: Db = null as any;

  beforeAll(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('returns graphql context', async () => {
    const authToken = signJwt({
      userId: '1',
      userRole: 'physician',
      lastLoginAt: new Date().toUTCString(),
    });
    const { userId, userRole } = await parseAndVerifyJwt(authToken);
    const context = await getGraphQLContext({
      headers: {
        auth_token: authToken,
      },
    } as any);
    expect(context).toMatchObject({
      userId,
      userRole,
    });
  });

  it('errors with invalid token', async () => {
    const authToken = 'fake';
    return parseAndVerifyJwt(authToken).catch(e => (
      expect(e).toEqual(new Error('jwt malformed'))
    ));
  });

  it('errors for token with old lastLoginAt', async () => {
    // user with newer loginTime
    const user = await User.create({
      email: 'a@b.com',
      userRole: 'physician',
      password: '1234',
      homeClinicId: '1',
    });
    user.updateLoginAt(new Date().toUTCString());

    const authToken = signJwt({
      userId: user.id,
      userRole: 'physician',
      lastLoginAt: 'Thu Apr 27 1970 22:20:57 GMT-0400 (EDT)',
    });
    return parseAndVerifyJwt(authToken).catch(e => (
      expect(e).toEqual(new Error('token invalid: login too old'))
    ));
  });

});
