import { transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';

import {
  getGraphQLContext,
  parseAndVerifyJwt,
  signJwt,
  TWENTY_FOUR_HOURS_IN_MILLISECONDS,
} from './../shared/utils';

describe('util tests', () => {
  beforeAll(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('returns graphql context', async () => {
    await transaction(User.knex(), async txn => {
      const authToken = signJwt({
        userId: uuid(),
        permissions: 'green',
        lastLoginAt: new Date().toISOString(),
      });
      const { userId, permissions } = await parseAndVerifyJwt(authToken, txn);
      const context = await getGraphQLContext(
        {
          headers: {
            auth_token: authToken,
          },
        } as any,
        { log: jest.fn() },
        txn,
      );
      expect(context).toMatchObject({
        userId,
        permissions,
        txn,
      });
    });
  });

  it('returns graphql context with anonymous user for invalid JWT', async () => {
    await transaction(User.knex(), async txn => {
      const authToken = signJwt({
        userId: uuid(),
        permissions: 'green',
        lastLoginAt: new Date('01/01/2010').toISOString(),
      });
      const context = await getGraphQLContext(
        {
          headers: {
            auth_token: authToken,
          },
        } as any,
        { log: jest.fn() },
        txn,
      );
      expect(context).toMatchObject({
        permissions: 'black',
        txn,
      });
    });
  });

  it('errors with invalid token', async () => {
    await transaction(User.knex(), async txn => {
      const authToken = 'fake';
      await expect(parseAndVerifyJwt(authToken, txn)).rejects.toMatchObject(
        new Error('jwt malformed'),
      );
    });
  });

  describe('old tokens', () => {
    it('errors for token when the user has more recently logged in on another device', async () => {
      await transaction(User.knex(), async txn => {
        const now = new Date();
        const clinic = await Clinic.create(createMockClinic(), txn);
        // user with newer loginTime
        const user = await User.create(createMockUser(11, clinic.id), txn);
        await User.update(user.id, { lastLoginAt: now.toISOString() }, txn);

        const authToken = signJwt({
          userId: user.id,
          permissions: 'green',
          lastLoginAt: new Date(now.valueOf() - 10000).toISOString(),
        });
        await expect(parseAndVerifyJwt(authToken, txn)).rejects.toMatchObject(
          new Error('token invalid: login too old'),
        );
      });
    });

    it('errors for token when the token is more than 24 hours old', async () => {
      await transaction(User.knex(), async txn => {
        const now = new Date();
        const authToken = signJwt({
          userId: uuid(),
          permissions: 'green',
          lastLoginAt: new Date(
            now.valueOf() - (TWENTY_FOUR_HOURS_IN_MILLISECONDS + 1000),
          ).toISOString(),
        });
        await expect(parseAndVerifyJwt(authToken, txn)).rejects.toMatchObject(
          new Error('token invalid: login too old'),
        );
      });
    });
  });
});
