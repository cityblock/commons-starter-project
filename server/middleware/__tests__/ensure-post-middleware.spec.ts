import * as httpMocks from 'node-mocks-http';
import { ensurePostMiddleware } from '../ensure-post-middleware';

describe('ensurePostMiddleware', () => {
  it('errors if not post', async () => {
    const request = httpMocks.createRequest({ method: 'AAA' } as any);
    const response = httpMocks.createResponse();
    response.send = jest.fn();
    const next = jest.fn();

    ensurePostMiddleware(request, response, next);
    expect(response.send).toBeCalledWith('Method Not Allowed');
  });

  it('calls next if post', async () => {
    const request = httpMocks.createRequest({ method: 'POST' });
    const response = httpMocks.createResponse();
    const next = jest.fn();

    ensurePostMiddleware(request, response, next);
    expect(next).toBeCalled();
  });
});
