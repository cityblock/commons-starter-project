import Db from '../../db';
import User from '../../models/user';
import {
  getGraphQLContext,
  parseAndVerifyJwt,
  signJwt,
  TWENTY_FOUR_HOURS_IN_MILLISECONDS,
} from './../shared/utils';

describe('util tests', () => {
  let db: Db;

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

  it('returns graphql context with anonymous user for invalid JWT', async () => {
    const authToken = signJwt({
      userId: '1',
      userRole: 'physician',
      lastLoginAt: new Date('01/01/2010').toUTCString(),
    });
    const context = await getGraphQLContext({
      headers: {
        auth_token: authToken,
      },
    } as any);
    expect(context).toMatchObject({
      userRole: 'anonymousUser',
    });
  });

  it('errors with invalid token', async () => {
    const authToken = 'fake';
    await expect(parseAndVerifyJwt(authToken))
      .rejects
      .toMatchObject({
        message: 'jwt malformed',
      });
  });

  describe('old tokens', () => {
    it('errors for token when the user has more recently logged in on another device', async () => {
      const now = new Date();
      // user with newer loginTime
      const user = await User.create({
        email: 'a@b.com',
        userRole: 'physician',
        homeClinicId: '1',
      });
      await User.update(user.id, { lastLoginAt: now.toUTCString() });

      const authToken = signJwt({
        userId: user.id,
        userRole: 'physician',
        lastLoginAt: (new Date(now.valueOf() - 10000)).toUTCString(),
      });
      await expect(parseAndVerifyJwt(authToken))
        .rejects
        .toMatchObject({
          message: 'token invalid: login too old',
        });
    });

    it('errors for token when the token is more than 24 hours old', async () => {
      const now = new Date();
      const authToken = signJwt({
        userId: '1',
        userRole: 'physician',
        lastLoginAt: (
          new Date(
            now.valueOf() - (TWENTY_FOUR_HOURS_IN_MILLISECONDS + 1000),
          )).toUTCString(),
      });
      await expect(parseAndVerifyJwt(authToken))
        .rejects
        .toMatchObject({
          message: 'token invalid: login too old',
        });
    });
  });
});
