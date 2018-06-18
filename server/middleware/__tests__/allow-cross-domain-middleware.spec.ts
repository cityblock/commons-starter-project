import httpMocks from 'node-mocks-http';
import { allowCrossDomainMiddleware } from '../allow-cross-domain-middleware';

describe('allowCrossDomainMiddleware', () => {
  it('adds headers for cross domain middleware', async () => {
    const request = httpMocks.createRequest({});
    const response = httpMocks.createResponse();
    const next = jest.fn();

    allowCrossDomainMiddleware(request, response, next);
    expect(next).toBeCalled();
    expect(response.getHeader('Access-Control-Allow-Origin')).toEqual('*');
    expect(response.getHeader('Access-Control-Allow-Methods')).toEqual('GET,PUT,POST,DELETE');
    expect(response.getHeader('Access-Control-Allow-Headers')).toEqual('Content-Type, auth_token');
  });
  it('adds headers for cross domain middleware', async () => {
    const request = httpMocks.createRequest({ method: 'OPTIONS' });
    const sendStatus = jest.fn();
    const response = httpMocks.createResponse();
    response.sendStatus = sendStatus;
    const next = jest.fn();

    allowCrossDomainMiddleware(request, response, next);
    expect(sendStatus).toBeCalledWith(200);
  });
});
