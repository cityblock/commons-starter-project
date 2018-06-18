import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import kue from 'kue';
import { Model, Transaction } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import TwilioClient from '../twilio-client';

/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

interface IProcessSmsMessageData {
  title: string;
  jobId: string;
}

interface ITwilioMediaInstance {
  sid: string;
}

interface ITwilioSmsMessage {
  sid: string;
  dateCreated: Date;
  dateUpdated: Date;
  status: string;
  from: string;
  to: string;
  body: string;
  media: () => {
    each: (callback: (mediaItem: ITwilioMediaInstance) => void) => void;
  };
}

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

const queue = kue.createQueue({ redis: createRedisClient() });

queue.process('processSmsMessage', async (job, done) => {
  try {
    logger.log('[Consumer][processSmsMessage] Started processing');
    await processSmsMessages(job.data);
    logger.log('[Consumer][processSmsMessage] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][processSmsMessage] Error processing');
    reportError(err, 'Kue error processSmsMessage');

    return done(err);
  }
});

export async function processSmsMessages(data: IProcessSmsMessageData, existingTxn?: Transaction) {
  const twilioClient = TwilioClient.get();

  twilioClient.messages.each((message: ITwilioSmsMessage) => {
    processSmsMessage(message, existingTxn);
  });
}

export async function processSmsMessage(message: ITwilioSmsMessage, existingTxn?: Transaction) {
  const { status, sid } = message;

  // do not delete messages that are in progress
  if (isInProgress(status)) {
    return;
  }
  // delete media associated message
  await deleteMedia(message);

  // delete record of message from Twilio
  await deleteSmsMessage(sid);
}

export async function deleteMedia(message: ITwilioSmsMessage) {
  const twilioClient = TwilioClient.get();

  message.media().each(async (mediaItem: ITwilioMediaInstance) => {
    await twilioClient
      .messages(message.sid)
      .media(mediaItem.sid)
      .remove();
  });
}

export async function deleteSmsMessage(sid: string) {
  const twilioClient = TwilioClient.get();

  await twilioClient.messages(sid).remove();
}

const isInProgress = (status: string): boolean => {
  return status !== 'delivered' && status !== 'received';
};
