import * as kue from 'kue';
import { createRedisClient } from '../lib/redis';
import { reportError } from './error-helpers';

const queue = kue.createQueue({ redis: createRedisClient() });

export function addJobToQueue(topic: string, data: object, message?: string) {
  queue
    .create(topic, {
      title: message || `Handling ${topic} message`,
      ...data,
    })
    .priority('low')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        reportError(err, `Error enqueuing ${topic} job`, data);
      }
    });
}
