import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import knexConfig from '../models/knexfile';
import TaskEvent, { ITaskEventOptions } from '../models/task-event';

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

queue.process('taskEvent', async (job, done) => {
  try {
    logger.log('[Consumer] [taskEvent] Started processing');
    await processTaskEvent(job.data);
    logger.log('[Consumer] [taskEvent] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][taskEvent] Error processing');
    reportError(err, 'Kue error taskEvent', job.data);

    return done(err);
  }
});

export async function processTaskEvent(data: ITaskEventOptions, existingTxn?: Transaction) {
  await transaction(existingTxn || TaskEvent.knex(), async txn => {
    await TaskEvent.create(data, txn);
  });
}
