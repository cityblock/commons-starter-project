import * as httpMocks from 'node-mocks-http';
import app from '../app';

describe('app', () => {
  it('should send valid html response', async () => {
    const request = httpMocks.createRequest();
    const response = httpMocks.createResponse();
    const send = jest.fn();
    response.status = jest.fn();
    (response.status as any).mockReturnValueOnce({ send });

    app(request, response);

    expect(response.status).toBeCalledWith(200);
    expect(send).toBeCalled();
  });
});
