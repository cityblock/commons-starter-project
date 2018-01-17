import * as httpMocks from 'node-mocks-http';
import { transaction } from 'objection';
import Db from '../../../db';
import Clinic from '../../../models/clinic';
import User from '../../../models/user';
import { createMockClinic } from '../../../spec-helpers';
import { checkPostgresHandler } from '../check-postgres-handler';

describe('postgres pingdom test', () => {
  let error: any;
  const userRole = 'physician';

  beforeEach(async () => {
    await Db.get();
    await Db.clear();
    error = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    await Db.release();
    console.error = error;
  });

  it('returns 200 with a patient', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.sendStatus = jest.fn();
    response.locals = {}; // response.locals is something Express.Response provides

    await transaction(User.knex(), async txn => {
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
  });

  it('errors if athena api call fails', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.status = jest.fn();
    response.locals = {};

    Db.get = async () => {
      throw new Error('omg db is borked');
    };

    (response.status as any).mockReturnValueOnce({ send: jest.fn() });

    await transaction(User.knex(), async txn => {
      response.locals.existingTxn = txn;
      await checkPostgresHandler(request, response);
      expect(response.status).toBeCalledWith(500);
    });
  });
});
