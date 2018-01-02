import * as httpMocks from 'node-mocks-http';
import { createHmac, pubsubValidator } from '../validator';

describe('validates requests actually come from google', () => {
  const response = httpMocks.createResponse();
  const next = jest.fn();
  let data: string = '';
  let base64Data: string = '';
  let now: number = Date.now();

  beforeEach(async () => {
    now = Date.now();
    data = `{"patientId":"patient-id","slug":"slug","value":"value","jobId":"job-id","timestamp":"${now}"}`;
    base64Data = new Buffer(data).toString('base64');
    response.sendStatus = jest.fn();
    response.end = jest.fn();
  });

  it('ends the request if data cannot be parsed', async () => {
    response.send = jest.fn();

    const badData = 'this is not json';
    const encodedBadData = new Buffer(badData).toString('base64');
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: encodedBadData,
          attributes: {
            hmac: createHmac(encodedBadData),
          },
        },
      },
    });
    await pubsubValidator(request, response, next);
    expect(response.send).toBeCalledWith('Problem parsing message data');
  });

  it('ends the request when the hmac is invalid', async () => {
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: base64Data,
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
    const hmac = createHmac(data);
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

  it('updates the request body with the parsed data when the hmac is valid', async () => {
    const hmac = createHmac(data);
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
    expect(request.body.message.data).toMatchObject({
      patientId: 'patient-id',
      slug: 'slug',
      value: 'value',
      jobId: 'job-id',
      timestamp: `${now}`,
    });
    expect(next).toBeCalled();
  });
});
