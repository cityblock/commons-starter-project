import * as httpMocks from 'node-mocks-http';
import AthenaApi from '../../../apis/athena';
import {
  createMockAthenaPatient,
  mockAthenaGetPatient,
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../../spec-helpers';
import { checkAthenaApiHandler } from '../check-athena-api-handler';

describe('athena api handler pingdom test', () => {
  let athenaApi: AthenaApi;
  let error: any;

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    mockAthenaTokenFetch();
    error = console.error;
    console.error = jest.fn();
  });

  afterEach(async () => {
    restoreAthenaFetch();
    console.error = error;
  });

  it('returns 200 with a patient', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.sendStatus = jest.fn();
    mockAthenaGetPatient(1, createMockAthenaPatient(1, 'Constance', 'Blanton'));

    await checkAthenaApiHandler(request, response);

    expect(response.sendStatus).toBeCalledWith(200);
  });

  it('errors if athena api call fails', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    response.status = jest.fn();
    (response.status as any).mockReturnValueOnce({ send: jest.fn() });

    await checkAthenaApiHandler(request, response);

    expect(response.status).toBeCalledWith(500);
  });
});
