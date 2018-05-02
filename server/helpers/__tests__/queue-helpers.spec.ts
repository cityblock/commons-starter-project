import * as kue from 'kue';
const queue = kue.createQueue();
import { addJobToQueue } from '../queue-helpers';

const topic = 'winterIsComing';
const data = {
  winter: 'isHere',
};
const customTitle = 'the North remembers';

describe('Queue Helpers', () => {
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

  describe('addJobToQueue', () => {
    it('adds a job to the Kue queue with default title', () => {
      // Check that the queue is empty
      expect(queue.testMode.jobs.length).toBe(0);

      addJobToQueue(topic, data);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        title: `Handling ${topic} message`,
        ...data,
      });
    });

    it('adds a job to the Kue queue with custom title', () => {
      // Check that the queue is empty
      expect(queue.testMode.jobs.length).toBe(0);

      addJobToQueue(topic, data, customTitle);

      expect(queue.testMode.jobs.length).toBe(1);
      expect(queue.testMode.jobs[0].data).toMatchObject({
        title: customTitle,
        ...data,
      });
    });
  });
});
