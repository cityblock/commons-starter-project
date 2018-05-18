import * as dotenv from 'dotenv';
dotenv.config();
import axios from 'axios';
import { format } from 'date-fns';
import * as Knex from 'knex';
import * as kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import { UserSignedUrlAction } from 'schema';
import config from '../config';
import { loadUserVoicemailUrl } from '../graphql/shared/gcs/helpers';
import { reportError } from '../helpers/error-helpers';
import { formatAbbreviatedName } from '../helpers/format-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import Voicemail from '../models/voicemail';
import TwilioClient from '../twilio-client';

const TWILIO_ROOT = 'https://api.twilio.com';
export const VOICEMAIL_DATE_FORMAT = 'ddd, MMM D, YYYY h:mma';

/* tslint:disable no-var-requires */
const knexConfig = require('../models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

interface IProcessVoicemailData {
  title: string;
  jobId: string;
}

interface ITwilioRecording {
  sid: string;
  callSid: string;
  uri: string;
  duration: string;
  dateCreated: Date;
  dateUpdated: Date;
  status: 'completed' | 'processing';
}

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

queue.process('processVoicemail', async (job, done) => {
  try {
    logger.log('[Consumer][processVoicemail] Started processing');
    await processVoicemails(job.data);
    logger.log('[Consumer][processVoicemail] Completed processing');
    return done();
  } catch (err) {
    logger.log('[Consumer][processVoicemail] Error processing');
    reportError(err, 'Kue error processVoicemail');
    return done(err);
  }
});

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

export async function processVoicemails(data: IProcessVoicemailData, existingTxn?: Transaction) {
  try {
    const twilioClient = TwilioClient.get();

    twilioClient.recordings.each((voicemail: ITwilioRecording) => {
      processVoicemail(voicemail, data.jobId, existingTxn);
    });
  } catch (err) {
    reportError(err, 'Error transferring voicemails', data);
  }
}

export async function processVoicemail(
  recording: ITwilioRecording,
  jobId: string,
  existingTxn?: Transaction,
) {
  const { uri, status, sid } = recording;
  // only process completed voicemails
  if (status !== 'completed') return;

  const twilioUrl = `${TWILIO_ROOT}${uri.slice(0, uri.length - 5)}.mp3`;

  try {
    // store record of voicemail in DB
    const voicemail = await createVoicemail(recording, jobId, existingTxn);
    // transfer it from Twilio to GCS
    await uploadVoicemail(twilioUrl, voicemail.phoneCall.userId, voicemail.id);
    // send SMS to user notifying them of voicemail
    await notifyUserOfVoicemail(voicemail);
    // delete voicemail from Twilio
    await deleteVoicemail(sid);
  } catch (err) {
    reportError(err, 'Error transferring voicemail', recording);
  }
}

export async function createVoicemail(
  recording: ITwilioRecording,
  jobId: string,
  existingTxn?: Transaction,
): Promise<Voicemail> {
  const { callSid, duration, dateCreated, dateUpdated } = recording;

  const voicemail: Voicemail | null = await transaction(
    existingTxn || Voicemail.knex(),
    async txn => {
      return Voicemail.create(
        {
          phoneCallSid: callSid,
          duration: parseInt(duration, 10),
          twilioCreatedAt: dateCreated.toISOString(),
          twilioUpdatedAt: dateUpdated.toISOString(),
          twilioPayload: recording,
          jobId,
        },
        txn,
      );
    },
  );

  if (!voicemail) {
    throw new Error('Error storing record of voicemail in database');
  }

  return voicemail;
}

export async function uploadVoicemail(twilioUrl: string, userId: string, voicemailId: string) {
  const signedUrl = await loadUserVoicemailUrl(userId, voicemailId, 'write' as UserSignedUrlAction);
  const audioFile = await axios.get(twilioUrl, {
    responseType: 'arraybuffer',
    headers: {
      'Content-Type': 'audio/mpeg',
    },
  });

  if (signedUrl && audioFile) {
    return axios.put(signedUrl, audioFile.data, {
      headers: {
        'Content-Type': 'audio/mpeg',
      },
    });
  } else {
    throw new Error('No signed url or audio file');
  }
}

export async function notifyUserOfVoicemail(voicemail: Voicemail) {
  const twilioClient = TwilioClient.get();
  const {
    phoneCall: {
      patient,
      contactNumber,
      user: { phone },
    },
    twilioCreatedAt,
  } = voicemail;

  const voicemailIdentity = patient
    ? `${formatAbbreviatedName(patient.firstName, patient.lastName)} at `
    : '';
  const formattedDate = format(twilioCreatedAt, VOICEMAIL_DATE_FORMAT);
  const body = `${voicemailIdentity}${contactNumber} left you a voicemail at ${formattedDate}. Click the following link to listen to the message.`;
  const voicemailUrl = `${config.GOOGLE_OAUTH_REDIRECT_URI}/voicemails/${voicemail.id}`;

  await twilioClient.messages.create({
    from: config.CITYBLOCK_VOICEMAIL,
    to: phone,
    body,
  });
  return twilioClient.messages.create({
    from: config.CITYBLOCK_VOICEMAIL,
    to: phone,
    body: voicemailUrl,
  });
}

export async function deleteVoicemail(sid: string) {
  const twilioClient = TwilioClient.get();

  return twilioClient.recordings(sid).remove();
}
