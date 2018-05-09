import * as kue from 'kue';
import * as uuid from 'uuid/v4';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';

export const VOICEMAIL_TOPIC = 'processVoicemail';

const queue = kue.createQueue({ redis: createRedisClient() });

export async function enqueueProcessVoicemail(): Promise<void> {
  await queue
    .create('processVoicemail', {
      title: `Handling ${VOICEMAIL_TOPIC} at ${new Date().toISOString()}`,
      jobId: uuid(),
    })
    .priority('normal')
    .attempts(5)
    .backoff({ type: 'exponential' })
    .save((err: Error) => {
      if (err) {
        reportError(err, `Error enqueuing ${VOICEMAIL_TOPIC} job`);
        process.exit(1);
      }

      process.exit(0);
    });
}

enqueueProcessVoicemail();
