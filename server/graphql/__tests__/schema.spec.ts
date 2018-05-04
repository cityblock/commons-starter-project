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
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  it('returns graphql context', async () => {
    const authToken = signJwt({
      userId: uuid(),
      permissions: 'green',
      lastLoginAt: new Date().toISOString(),
    });
    const { userId, permissions } = await parseAndVerifyJwt(authToken, txn);
    const context = await getGraphQLContext(authToken, { log: jest.fn() } as any, {
      request: {
        headers: {
          auth_token: authToken,
        },
        body: {
          variables: {
            foo: 'bar',
          },
          query: 'foo',
        },
      } as any,
      response: {
        status: 200,
      } as any,
      existingTxn: txn,
    });
    expect(context).toMatchObject({
      userId,
      permissions,
      txn,
    });
  });

  it('returns graphql context with anonymous user for invalid JWT', async () => {
    const authToken = signJwt({
      userId: uuid(),
      permissions: 'green',
      lastLoginAt: new Date('01/01/2010').toISOString(),
    });
    const context = await getGraphQLContext(authToken, { log: jest.fn() } as any, {
      request: {
        headers: {
          auth_token: authToken,
        },
        body: {
          variables: {
            foo: 'bar',
          },
          query: 'foo',
        },
      } as any,
      response: {
        status: 200,
      } as any,
      existingTxn: txn,
    });
    expect(context).toMatchObject({
      permissions: 'black',
      txn,
    });
  });

  it('errors with invalid token', async () => {
    const authToken = 'fake';
    await expect(parseAndVerifyJwt(authToken, txn)).rejects.toMatchObject(
      new Error('jwt malformed'),
    );
  });

  describe('old tokens', () => {
    it('errors for token when the user has more recently logged in on another device', async () => {
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

    it('errors for token when the token is more than 24 hours old', async () => {
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
