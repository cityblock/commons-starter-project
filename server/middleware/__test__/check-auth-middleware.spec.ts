import base64 from 'base-64';
import httpMocks from 'node-mocks-http';
import { checkAuthMiddleware } from '../check-auth-middleware';

describe('basicAuth', () => {
  it('calls next() for authorized requests', async () => {
    const request = httpMocks.createRequest({
      headers: {
        Authorization: `Basic ${base64.encode('username:password')}`,
      },
    });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    checkAuthMiddleware('username', 'password')(request, response, next);
    expect(next).toBeCalled();
  });

  it('returns a 401 status for unauthorized requests', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const next = jest.fn();
    response.sendStatus = jest.fn();

    checkAuthMiddleware('username', 'password')(request, response, next);
    expect(next).not.toBeCalled();
    expect(response.sendStatus).toBeCalledWith(401);
  });
});
