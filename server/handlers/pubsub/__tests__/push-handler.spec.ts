import * as kue from 'kue';
import * as httpMocks from 'node-mocks-http';
import * as uuid from 'uuid/v4';
import { pubsubPushHandler } from '../push-handler';
import { createHmac } from '../validator';

const queue = kue.createQueue();
const response = httpMocks.createResponse();
const originalConsoleError = console.error;

describe('handling pubsub push events from mixer', () => {
  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    console.error = jest.fn();
    queue.testMode.clear();
  });

  afterAll(async () => {
    console.error = originalConsoleError;
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  it('adds a new computedField job to the Kue queue', async () => {
    const patientId = uuid();
    const slug = 'computed-field-slug';
    const value = 'computed-field-value';
    const jobId = 'job-id';

    // Check that the queue is empty
    expect(queue.testMode.jobs.length).toEqual(0);

    const requestData = { patientId, slug, value, jobId };
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: requestData,
          attributes: {
            hmac: createHmac(JSON.stringify(requestData)),
            topic: 'computedField',
          },
        },
      },
    });
    await pubsubPushHandler(request, response);

    // Check that a new job with the correct data has been enqueued
    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      title: `Handling computedField message for patient: ${patientId}`,
      patientId,
      slug,
      value,
      jobId,
    });
  });

  it('adds a new memberAttribution job to the Kue queue', async () => {
    const patientId = uuid();
    const cityblockId = 12345678;

    // Check that the queue is empty
    expect(queue.testMode.jobs.length).toEqual(0);

    const requestData = { patientId, cityblockId };
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: requestData,
          attributes: {
            hmac: createHmac(JSON.stringify(requestData)),
            topic: 'memberAttribution',
          },
        },
      },
    });
    await pubsubPushHandler(request, response);

    // Check that a new job with the correct data has been enqueued
    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      title: `Handling memberAttribution message for patient: ${patientId}`,
      patientId,
      cityblockId,
    });
  });

  it('logs an error when given a payload with an invalid topic', async () => {
    const patientId = uuid();
    const invalidTopic = 'invalidTopic';

    // Check that the queue is empty
    expect(queue.testMode.jobs.length).toEqual(0);

    const requestData = { patientId };
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: requestData,
          attributes: {
            hmac: createHmac(JSON.stringify(requestData)),
            topic: invalidTopic,
          },
        },
      },
    });
    await pubsubPushHandler(request, response);

    // Check that an error is logged
    expect(console.error).toBeCalledWith(`Unknown topic: ${invalidTopic}`);
    // Check that the queue is still empty
    expect(queue.testMode.jobs.length).toEqual(0);
  });

  it('logs an error when given a payload without a topic', async () => {
    const patientId = uuid();

    // Check that the queue is empty
    expect(queue.testMode.jobs.length).toEqual(0);

    const requestData = { patientId };
    const request = httpMocks.createRequest({
      method: 'POST',
      url: '/pubsub/push',
      body: {
        message: {
          data: requestData,
          attributes: {
            hmac: createHmac(JSON.stringify(requestData)),
          },
        },
      },
    });
    await pubsubPushHandler(request, response);

    // Check that an error is logged
    expect(console.error).toBeCalledWith('Unknown topic: undefined');
    // Check that the queue is still empty
    expect(queue.testMode.jobs.length).toEqual(0);
  });
});
