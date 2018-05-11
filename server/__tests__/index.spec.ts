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
    config.GCP_CREDS = '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}' as any;
  });

  afterEach(async () => {
    await txn.rollback();
    config.GCP_CREDS = null as any;
    await User.knex().raw('TRUNCATE TABLE public.user CASCADE');
    await User.knex().raw('TRUNCATE TABLE public.clinic CASCADE');
  });

  it('should be able to Initialize a server (production)', async () => {
    const server = await main({ env: 'production', allowCrossDomainRequests: true });
    return server.close();
  });

  it('should error for invalid http methods', async () => {
    const server = await main({
      env: 'production',
      allowCrossDomainRequests: true,
      transaction: txn,
    });

    const query = `query {
      currentUser {
        id, email
      }
    }`;

    const authToken = signJwt({
      userId: 'foo',
      permissions: 'green',
      lastLoginAt: new Date().toISOString(),
    });

    await expect(
      request.put(
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
      ),
    ).rejects.toMatchObject(new Error('Request failed with status code 405'));
    return server.close();
  });

  it('should be able to place graphql queries', async () => {
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

  it('returns errors from graphql mutations that throw an error', async () => {
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
