import * as httpMocks from 'node-mocks-http';
import { addSecurityHeadersMiddleware } from '../add-security-headers-middleware';

describe('addHeadersMiddleware', () => {
  it('adds security headers', async () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const next = jest.fn();

    addSecurityHeadersMiddleware(request, response, next);
    expect(next).toBeCalled();
    expect(response.getHeader('Access-Control-Allow-Methods')).toEqual('POST');
    expect(response.getHeader('Cache-Control')).toEqual('no-cache, no-store');
    expect(response.getHeader('Content-Security-Policy')).toEqual(
      "default-src 'self' https://accounts.google.com blob:; script-src 'self' *.google.com unpkg.com; style-src 'self' https://fonts.googleapis.com 'unsafe-inline' blob:; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' *.googleusercontent.com https://storage.googleapis.com data: blob:; connect-src 'self' https://storage.googleapis.com ws://localhost:3000/subscriptions; frame-ancestors 'none'",
    );
    expect(response.getHeader('Strict-Transport-Security')).toEqual(
      'max-age=31536000; includeSubDomains; preload',
    );
  });
});
