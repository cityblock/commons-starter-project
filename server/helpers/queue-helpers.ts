import * as kue from 'kue';
import { createRedisClient } from '../lib/redis';
import { reportError } from './error-helpers';

type Priority = 'low' | 'medium' | 'high';

const queue = kue.createQueue({ redis: createRedisClient() });

export function addJobToQueue(topic: string, data: object, message?: string, priority?: Priority) {
  queue
    .create(topic, {
      title: message || `Handling ${topic} message`,
      ...data,
    })
    .priority(priority || 'low')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        reportError(err, `Error enqueuing ${topic} job`, data);
      }
    });
}
