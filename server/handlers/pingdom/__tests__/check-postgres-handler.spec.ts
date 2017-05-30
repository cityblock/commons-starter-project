import * as httpMocks from 'node-mocks-http';
import Db from '../../../db';
import User from '../../../models/user';
import { checkPostgresHandler } from '../check-postgres-handler';

describe('postgres pingdom test', () => {
  let db: Db = null as any;
  let error: any;
  const userRole = 'physician';

  beforeEach(async () => {
    db = await Db.get();
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

    await User.create({
      email: 'brennan@sidewalklabs.com',
      firstName: 'Bertrand',
      lastName: 'Russell',
      userRole,
      homeClinicId: '1',
    });

    await checkPostgresHandler(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  it('errors if athena api call fails', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.status = jest.fn();
    Db.get = async () => {
      throw new Error('omg db is borked');
    };

    (response.status as any).mockReturnValueOnce({ send: jest.fn() });

    await checkPostgresHandler(request, response);

    expect(response.status).toBeCalledWith(500);
  });
});
