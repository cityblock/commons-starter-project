import * as httpMocks from 'node-mocks-http';
import { transaction } from 'objection';
import { UserRole } from 'schema';
import config from '../../../config';
import Clinic from '../../../models/clinic';
import User from '../../../models/user';
import { createMockClinic } from '../../../spec-helpers';
import { checkPostgresHandler } from '../check-postgres-handler';

describe('postgres pingdom test', () => {
  let error: any;
  let txn = null as any;
  const userRole = 'physician' as UserRole;

  beforeAll(() => {
    (config.GCP_CREDS as any) = '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}';
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    (config.GCP_CREDS as any) = null;
  });

  beforeEach(async () => {
    error = console.error;
    console.error = jest.fn();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
    console.error = error;
  });

  it('returns 200 with a patient', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.sendStatus = jest.fn();
    response.locals = {}; // response.locals is something Express.Response provides

    response.locals.existingTxn = txn;
    const clinic = await Clinic.create(createMockClinic(), txn);
    await User.create(
      {
        email: 'brennan@cityblock.com',
        firstName: 'Bertrand',
        lastName: 'Russell',
        userRole,
        homeClinicId: clinic.id,
      },
      txn,
    );

    await checkPostgresHandler(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  xit('errors if postgres fails', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.status = jest.fn();
    response.locals = {};

    // Db.get = async () => {
    //   throw new Error('omg db is borked');
    // };

    (response.status as any).mockReturnValueOnce({ send: jest.fn() });

    response.locals.existingTxn = txn;
    await checkPostgresHandler(request, response);
    expect(response.status).toBeCalledWith(500);
  });
});
