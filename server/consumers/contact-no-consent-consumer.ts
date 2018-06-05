import * as dotenv from 'dotenv';
dotenv.config();

import * as Knex from 'knex';
import * as kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { formatAbbreviatedName } from '../helpers/format-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import * as knexConfig from '../models/knexfile';
import Patient from '../models/patient';
import User from '../models/user';
import TwilioClient from '../twilio-client';

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

type NoConsent = 'smsMessage' | 'phoneCall';

interface IProcessContactNoConsentData {
  patientId: string;
  userId: string;
  type: NoConsent;
}

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

queue.process('notifyNoConsent', async (job, done) => {
  try {
    logger.log('[Consumer][notifyNoConsent] Started processing');
    await processNotifyNoConsent(job.data);
    logger.log('[Consumer][notifyNoConsent] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][notifyNoConsent] Error processing');
    reportError(err, 'Kue error notifyNoConsent');

    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processNotifyNoConsent(
  data: IProcessContactNoConsentData,
  existingTxn?: Transaction,
): Promise<void> {
  await transaction(existingTxn || Patient.knex(), async txn => {
    const user = await User.get(data.userId, txn);

    // throw error if user doesn't have phone number registered
    // (unlikely as jobs are queued when they use phone to contact patient)
    if (!user.phone) {
      throw new Error(`User ${user.id} does not have phone number registered in Commons.`);
    }

    const patient = await Patient.get(data.patientId, txn);

    await notifyUserOfNoConsent(user, patient, data.type);
  });
}

export async function notifyUserOfNoConsent(
  user: User,
  patient: Patient,
  type: NoConsent,
): Promise<void> {
  const patientName = formatAbbreviatedName(
    patient.firstName,
    patient.lastName,
    patient.patientInfo.preferredName,
  );

  const noun = type === 'smsMessage' ? 'text message' : 'phone call';
  const verb = type === 'smsMessage' ? 'texting' : 'calling';

  const fullMessage = `${patientName} has not consented to being contacted via ${noun}. Please refrain from ${verb} this member in the future.`;

  const twilioClient = TwilioClient.get();

  // send message to user
  await twilioClient.messages.create({
    from: config.CITYBLOCK_ADMIN,
    to: user.phone,
    body: fullMessage,
  });
}
