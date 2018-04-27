import * as kue from 'kue';
import * as uuid from 'uuid/v4';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';

export const VOICEMAIL_TOPIC = 'processVoicemail';

export interface IProcessVoicemailData {
  title: string;
  jobId: string;
}

const queue = kue.createQueue({ redis: createRedisClient() });

/* tslint:disable no-console */
export async function enqueueProcessVoicemail(): Promise<void> {
  queue
    .create(VOICEMAIL_TOPIC, {
      title: `Handling ${VOICEMAIL_TOPIC} at ${new Date().toISOString()}`,
      jobId: uuid(),
    })
    .priority('normal')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        reportError(err, `Error enqueuing ${VOICEMAIL_TOPIC} job`);
      }
    });
}
/* tslint:enable no-console */

enqueueProcessVoicemail();
