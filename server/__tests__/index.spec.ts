import request from 'axios';
import { transaction } from 'objection';
import { UserRole } from 'schema';
import config from '../config';
import { signJwt } from '../graphql/shared/utils';
import { main } from '../index';
import Clinic from '../models/clinic';
import User from '../models/user';

config.PORT = '3001'; // Use a different route for testing than serving.

const GRAPHQL_ROUTE = '/graphql';

describe('main', () => {
  let txn = null as any;

  beforeEach(async () => {
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
    const destroyTransaction = await transaction.start(User.knex());
    await destroyTransaction
      .withSchema('information_schema')
      .select('table_name')
      .from('tables')
      .whereRaw(`table_catalog = ? AND table_schema = ? AND table_name != ?`, [
        'public',
        'knex_migrations',
      ])
      .map(async (row: any) => {
        await destroyTransaction.raw(`TRUNCATE TABLE public.${row.table_name} CASCADE`);
      });
  });

  xit('should be able to Initialize a server (production)', async () => {
    const server = await main({ env: 'production', allowCrossDomainRequests: true });
    return server.close();
  });

  xit('should be able to place graphql queries', async () => {
    const user = await transaction(User.knex(), async innerTxn => {
      const clinic = await Clinic.create(
        {
          name: 'foo',
          departmentId: 1,
        },
        innerTxn,
      );
      return User.create(
        { homeClinicId: clinic.id, email: 'a@b.com', userRole: 'admin' as UserRole },
        innerTxn,
      );
    });

    const authToken = signJwt({
      userId: user.id,
      permissions: 'green',
      lastLoginAt: new Date().toISOString(),
    });

    const server = await main({
      env: 'test',
      transaction: txn,
      allowCrossDomainRequests: true,
    });
    const query = `query {
        currentUser {
          id, email
        }
      }`;

    const res = await request.post(
      `http://localhost:${config.PORT}${GRAPHQL_ROUTE}`,
      { query },
      {
        headers: {
          'Content-Type': 'application/json',
          origin: `http://localhost:${config.PORT}`,
          'accept-encoding': 'gzip, deflate, br',
          auth_token: authToken,
        },
      },
    );

    expect(res.status).toBe(200);
    expect(res.data.data).toEqual({
      currentUser: {
        id: user.id,
        email: 'a@b.com',
      },
    });
    return server.close();
  });

  xit('returns errors from graphql mutations that throw an error', async () => {
    const email = 'a@b.com';
    const user = await transaction(User.knex(), async innerTxn => {
      const clinic = await Clinic.create(
        {
          name: 'foo',
          departmentId: 1,
        },
        innerTxn,
      );
      return User.create(
        { homeClinicId: clinic.id, email, userRole: 'admin' as UserRole },
        innerTxn,
      );
    });
    const authToken = signJwt({
      userId: user.id,
      permissions: 'green',
      lastLoginAt: new Date().toISOString(),
    });

    const server = await main({
      env: 'test',
      transaction: txn,
      allowCrossDomainRequests: true,
    });
    const mutation = `mutation userCreate($email: String!, $homeClinicId: ID!) {
        userCreate(input: {email: $email, homeClinicId: $homeClinicId}) {
          id, email
        }
      }`;
    const variables = {
      email,
      homeClinicId: user.homeClinicId,
    };
    const res = await request.post(
      `http://localhost:${config.PORT}${GRAPHQL_ROUTE}`,
      { query: mutation, variables },
      {
        headers: {
          'Content-Type': 'application/json',
          origin: `http://localhost:${config.PORT}`,
          'accept-encoding': 'gzip, deflate, br',
          auth_token: authToken,
        },
      },
    );
    expect(res.data.errors[0].message).toEqual(
      'Cannot create account: Email already exists for a@b.com',
    );
    expect(res.status).toBe(200);
    return server.close();
  });
});
