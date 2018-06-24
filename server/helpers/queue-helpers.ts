import kue from 'kue';
import uuid from 'uuid/v4';
import { createRedisClient } from '../lib/redis';
import { reportError } from './error-helpers';

type Priority = 'low' | 'medium' | 'high';

interface IAddJobToQueueOptions {
  message?: string;
  priority?: Priority;
  exit?: boolean;
}

const queue = kue.createQueue({ redis: createRedisClient() });

export function addJobToQueue(topic: string, data: object, options?: IAddJobToQueueOptions) {
  const { message, priority, exit } = Object.assign({}, options);
  queue
    .create(topic, {
      title: message || `Handling ${topic} message`,
      ...data,
    })
    .priority(priority || 'normal')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        reportError(err, `Error enqueuing ${topic} job`, data);

        if (exit) {
          process.exit(1);
        }
      }

      if (exit) {
        process.exit(0);
      }
    });
}

export function addProcessingJobToQueue(topic: string, testMode?: boolean) {
  const message = `Handling ${topic} at ${new Date().toISOString()}`;
  const data = { jobId: uuid() };

  const options: IAddJobToQueueOptions = {
    message,
    priority: 'medium',
  };
  // actually exit process if not in test mode
  if (!testMode) {
    options.exit = true;
  }

  addJobToQueue(topic, data, options);
}

export default { addJobToQueue, addProcessingJobToQueue };
