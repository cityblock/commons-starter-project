import * as base64 from 'base-64';
import * as httpMocks from 'node-mocks-http';
import { addHeadersMiddleware, checkAuth } from '../express';

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

describe('addHeadersMiddleware', () => {
  it('adds security headers', async () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const next = jest.fn();

    addHeadersMiddleware(request, response, next);
    expect(next).toBeCalled();
    expect(response.getHeader('Cache-Control')).toEqual('no-cache, no-store');
    expect(response.getHeader('Content-Security-Policy')).toEqual(
      "default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com https://storage.googleapis.com data: blob:; connect-src 'self' https://storage.googleapis.com ws://localhost:3000/subscriptions",
    );
    expect(response.getHeader('Strict-Transport-Security')).toEqual(
      'max-age=31536000; includeSubDomains; preload',
    );
  });
});
