import * as kue from 'kue';
import * as httpMocks from 'node-mocks-http';
import * as uuid from 'uuid';
import { pubsubPushHandler } from '../push-handler';
import { createHmac } from '../validator';

const queue = kue.createQueue();
const response = httpMocks.createResponse();

describe('handling pubsub push events from mixer', () => {
  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  it('adds a newComputedFieldValue job to the Kue queue', async () => {
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
          },
        },
      },
    });
    await pubsubPushHandler(request, response);

    // Check that a new job with the correct data has been enqueued
    expect(queue.testMode.jobs.length).toEqual(1);
    expect(queue.testMode.jobs[0].data).toMatchObject({
      title: `Handling new ComputedField value for patient: ${patientId}`,
      patientId,
      slug,
      value,
      jobId,
    });
  });
});
