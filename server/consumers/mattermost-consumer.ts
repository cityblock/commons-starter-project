import * as dotenv from 'dotenv';
dotenv.config();

import * as Knex from 'knex';
import * as kue from 'kue';
import { Model } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Mattermost, { ADD_USER_TO_CHANNEL_TOPIC } from '../mattermost';

const queue = kue.createQueue({ redis: createRedisClient() });
/* tslint:disable no-var-requires */
const knexConfig = require('./models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

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
