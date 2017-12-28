import * as httpMocks from 'node-mocks-http';
import { createHmac, pubsubValidator } from '../validator';

describe('validates requests actually come from google', () => {
  const response = httpMocks.createResponse();
  const next = jest.fn();

  beforeEach(async () => {
    response.sendStatus = jest.fn();
    response.end = jest.fn();
  });

  it('ends the request when the hmac is invalid', async () => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: 'someBase64EncodedData==',
          attributes: {
            hmac: 'someFakeHmac',
          },
        },
      },
    });
    pubsubValidator(request, response, next);
    expect(response.end).toBeCalled();
    expect(next).not.toBeCalled();
  });

  it('allows the request to proceed when the hmac is valid', async () => {
    const now = Date.now();

    const data = `{"patientId":"patient-id","slug":"slug","value":"value","jobId":"job-id","timestamp":"${now}"}`;

    const base64Data = new Buffer(data).toString('base64');
    const hmac = createHmac(base64Data);
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: base64Data,
          attributes: {
            hmac,
          },
        },
      },
    });
    pubsubValidator(request, response, next);
    expect(response.end).not.toBeCalled();
    expect(next).toBeCalled();
  });
});
