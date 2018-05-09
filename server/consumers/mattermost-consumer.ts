import * as dotenv from 'dotenv';
dotenv.config();

import * as kue from 'kue';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Mattermost, { ADD_USER_TO_CHANNEL_TOPIC } from '../mattermost';

const queue = kue.createQueue({ redis: createRedisClient() });

queue.process(ADD_USER_TO_CHANNEL_TOPIC, async (job, done) => {
  try {
    const {
      data: { userId, patientId },
    } = job;

    const mattermost = Mattermost.get();
    await mattermost.addUserToPatientChannel(patientId, userId);

    return done();
  } catch (err) {
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue error');
});
