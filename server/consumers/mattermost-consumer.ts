import * as dotenv from 'dotenv';
dotenv.config();
import * as Knex from 'knex';
import * as kue from 'kue';
import { Model } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import Mattermost, { ADD_USER_TO_CHANNEL_TOPIC } from '../mattermost';

const queue = kue.createQueue({ redis: createRedisClient() });
/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

queue.process(ADD_USER_TO_CHANNEL_TOPIC, async (job, done) => {
  logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Started processing`);
  try {
    const {
      data: { userId, patientId },
    } = job;

    const mattermost = Mattermost.get();
    await mattermost.addUserToPatientChannel(patientId, userId);
    logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Completed processing`);
    return done();
  } catch (err) {
    logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Error processing`);
    reportError(err, `Kue error ${ADD_USER_TO_CHANNEL_TOPIC}`);
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});
