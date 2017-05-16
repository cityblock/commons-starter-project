import * as httpMocks from 'node-mocks-http';
import AthenaApi from '../../../apis/athena';
import {
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../../spec-helpers';
import { checkAthenaApiHandler } from '../check-athena-api-handler';

describe('appointments', () => {
  let athenaApi: AthenaApi = null as any;

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    mockAthenaTokenFetch();
  });

  afterEach(async () => {
    restoreAthenaFetch();
  });

  xit('returns 200 with a patient', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    expect(response.sendStatus).toBeCalledWith(200);
    await checkAthenaApiHandler(request, response);
  });
});
