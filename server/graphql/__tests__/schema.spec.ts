import { transaction } from 'objection';
import uuid from 'uuid/v4';

import Clinic from '../../models/clinic';
import User from '../../models/user';
import { createMockClinic, createMockUser } from '../../spec-helpers';

import {
  getGraphQLContext,
  parseAndVerifyJwt,
  signJwt,
  TWENTY_FOUR_HOURS_IN_MILLISECONDS,
} from '../shared/utils';

describe('util tests', () => {
  let txn = null as any;
  const errorReporting = {
    report: jest.fn(),
  } as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  it('returns graphql context', async () => {
    const authToken = signJwt({
      userId: uuid(),
      permissions: 'green',
      lastLoginAt: new Date().toISOString(),
    });
    const { userId, permissions } = await parseAndVerifyJwt(authToken);
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
      errorReporting,
    });
    expect(context).toMatchObject({
      userId,
      permissions,
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
      errorReporting,
    });
    expect(context).toMatchObject({
      permissions: 'black',
    });
  });

  it('errors with invalid token', async () => {
    const authToken = 'fake';
    await expect(parseAndVerifyJwt(authToken)).rejects.toMatchObject(new Error('jwt malformed'));
  });

  describe('old tokens', () => {
    it('errors for token when the user has more recently logged in on another device', async () => {
      const now = new Date();
      const clinic = await Clinic.create(createMockClinic(), txn);
      // user with newer loginTime
      const user = await User.create(createMockUser(11, clinic.id), txn);
      await User.update(user.id, { lastLoginAt: now.toISOString() }, txn);

      // Need to commit the transaction since parseAndVerifyJwt doesn't use a transaction.
      await txn.commit();

      const authToken = signJwt({
        userId: user.id,
        permissions: 'green',
        lastLoginAt: new Date(now.valueOf() - 10000).toISOString(),
      });
      await expect(parseAndVerifyJwt(authToken)).rejects.toMatchObject(
        new Error('token invalid: login too old'),
      );

      // clean up committed data
      await User.knex().raw('TRUNCATE TABLE public.user CASCADE');
      await User.knex().raw('TRUNCATE TABLE public.clinic CASCADE');
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
      await expect(parseAndVerifyJwt(authToken)).rejects.toMatchObject(
        new Error('token invalid: login too old'),
      );
    });
  });
});
