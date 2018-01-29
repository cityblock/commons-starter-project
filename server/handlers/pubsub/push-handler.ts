import * as express from 'express';
import * as kue from 'kue';
import { createRedisClient } from '../../lib/redis';

const queue = kue.createQueue({ redis: createRedisClient() });

export interface IComputedFieldMessageData {
  patientId?: string;
  slug?: string;
  value?: string | number | boolean;
  jobId?: string;
}

/* tslint:disable no-console */
export async function pubsubPushHandler(req: express.Request, res: express.Response) {
  const { patientId, slug, value, jobId } = req.body.message.data;

  queue
    .create('newComputedFieldValue', {
      title: `Handling new ComputedField value for patient: ${patientId}`,
      patientId,
      slug,
      value,
      jobId,
    })
    .priority('low')
    .attempts(3)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        console.log(
          `Error enqueuing job. patientId: ${patientId}, slug: ${slug}, value: ${value}, jobId: ${jobId}`,
          err.message,
        );
      }
    });

  res.sendStatus(200);
}
/* tslint:enable no-console */
