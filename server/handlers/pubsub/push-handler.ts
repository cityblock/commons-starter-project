import * as express from 'express';
import * as kue from 'kue';
import { createRedisClient } from '../../lib/redis';

const queue = kue.createQueue({ redis: createRedisClient() });

// TODO: These typings need fixing. Likely going to want to type the whole message
export interface IComputedFieldMessageData {
  patientId: string;
  slug: string;
  value: string | number | boolean;
  jobId: string;
}

export interface IMemberAttributionMessageData {
  patientId: string;
  cityblockId: string;
  // TBD
}

/* tslint:disable no-console */
export async function pubsubPushHandler(req: express.Request, res: express.Response) {
  const { data, attributes } = req.body.message;
  const { patientId } = data;
  const { topic } = attributes;

  switch (topic) {
    case 'computedField':
      queue
        .create('newComputedField', {
          title: `Handling newComputedField message for patient: ${patientId}`,
          ...data,
        })
        .priority('low')
        .attempts(5)
        .backoff({ type: 'exponential' })
        .save((err: Error) => {
          if (err) {
            console.log(
              `Error enqueuing newComputedField job. patientId: ${patientId}, slug: ${
                data.slug
              }, value: ${data.value}, jobId: ${data.jobId}`,
              err.message,
            );
          }
        });
      return res.sendStatus(200);
    case 'memberAttribution':
      queue
        .create('newMemberAttribution', {
          title: `Handling newMemberAttribution message for patient: ${patientId}`,
          ...data,
        })
        .priority('low')
        .attempts(5)
        .backoff({ type: 'exponential' })
        .save((err: Error) => {
          if (err) {
            console.log(
              `Error enqueuing newMemberAttributionJob. patientId: ${patientId}, cityblockId: ${
                data.cityblockId
              }`,
              err.message,
            );
          }
        });
      return res.sendStatus(200);
    default:
      console.error(`Unknown topic: ${topic}`);
      return res.sendStatus(200);
  }
}
/* tslint:enable no-console */
