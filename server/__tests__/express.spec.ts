import * as base64 from 'base-64';
import * as httpMocks from 'node-mocks-http';
import { checkAuth } from '../express';

describe('basicAuth', () => {
  it('calls next() for authorized requests', async () => {
    const request = httpMocks.createRequest({
      headers: {
        Authorization: `Basic ${base64.encode('username:password')}`,
      },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    checkAuth('username', 'password')(request, response, next);
    expect(next).toBeCalled();
  });

  it('returns a 401 status for unauthorized requests', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    response.sendStatus = jest.fn();

    checkAuth('username', 'password')(request, response, next);
    expect(next).not.toBeCalled();
    expect(response.sendStatus).toBeCalledWith(401);
  });
});
