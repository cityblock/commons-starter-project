import * as dotenv from 'dotenv';
dotenv.config();
import * as Knex from 'knex';
import * as kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import { SmsMessageDirection } from 'schema';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import PhoneCall, { CallStatus } from '../models/phone-call';
import User from '../models/user';
import TwilioClient from '../twilio-client';

/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

interface IProcessPhoneCallData {
  title: string;
  jobId: string;
}

interface ITwilioPhoneCall {
  sid: string;
  parentCallSid: string | null;
  dateCreated: string;
  dateUpdated: string;
  to: string;
  from: string;
  status: CallStatus;
  duration: string | null;
}

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

const queue = kue.createQueue({ redis: createRedisClient() });

queue.process('processPhoneCall', async (job, done) => {
  try {
    logger.log('[Consumer][processPhoneCall] Started processing');
    await processPhoneCalls(job.data);
    logger.log('[Consumer][processPhoneCall] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][processPhoneCall] Error processing');
    reportError(err, 'Kue error processPhoneCall');

    return done(err);
  }
});

export async function processPhoneCalls(data: IProcessPhoneCallData, existingTxn?: Transaction) {
  try {
    const twilioClient = TwilioClient.get();

    twilioClient.calls.each((call: ITwilioPhoneCall) => {
      processPhoneCall(call, existingTxn);
    });
  } catch (err) {
    reportError(err, 'Error processing phone calls', data);
  }
}

export async function processPhoneCall(call: ITwilioPhoneCall, existingTxn?: Transaction) {
  const { sid, parentCallSid, status } = call;

  // do not delete calls that are in progress
  if (isInProgress(status)) {
    return;
  }

  await transaction(existingTxn || PhoneCall.knex(), async txn => {
    // only store record of actual care worker to patient calls, not intermediate routing calls
    if (parentCallSid) {
      const phoneCall = await PhoneCall.getByCallSid(parentCallSid, txn);

      // if phone call does not exist, create record of it in DB
      if (!phoneCall) {
        await createPhoneCall(call, txn);
      }
    }
    // delete record of phone call from Twilio
    await deletePhoneCall(sid);
  });
}

export async function createPhoneCall(call: ITwilioPhoneCall, existingTxn?: Transaction) {
  const { to, from, sid, parentCallSid, status, duration, dateCreated, dateUpdated } = call;
  const isInbound = to.includes('sim:');

  await transaction(existingTxn || PhoneCall.knex(), async txn => {
    const user = isInbound
      ? await User.getBy({ fieldName: 'twilioSimId', field: to.substring(4) }, txn)
      : await User.getBy({ fieldName: 'phone', field: from }, txn);

    if (!user) {
      throw new Error(
        `There is not user with the Twilio Phone Number: ${to} or Twilio SIM: ${from}`,
      );
    }

    await PhoneCall.create(
      {
        userId: user.id,
        contactNumber: isInbound ? from : to,
        direction: isInbound
          ? ('toUser' as SmsMessageDirection)
          : ('fromUser' as SmsMessageDirection),
        callStatus: status,
        duration: duration ? Number(duration) : 0,
        twilioPayload: call,
        callSid: parentCallSid || sid,
        twilioCreatedAt: dateCreated,
        twilioUpdatedAt: dateUpdated,
      },
      txn,
    );
  });
}

export async function deletePhoneCall(sid: string) {
  const twilioClient = TwilioClient.get();

  await twilioClient.calls(sid).remove();
}

const isInProgress = (status: CallStatus): boolean => {
  return (
    status === 'ringing' || status === 'in-progress' || status === 'queued' || status === 'busy'
  );
};
