import dotenv from 'dotenv';
dotenv.config();
import Knex from 'knex';
import kue from 'kue';
import { Model } from 'objection';
import config from '../config';
import { reportError } from '../helpers/error-helpers';
import { createRedisClient } from '../lib/redis';
import Logging from '../logging';
import { ADD_USER_TO_CHANNEL_TOPIC } from '../mattermost';
import knexConfig from '../models/knexfile';
import { processAfterHoursCommunications } from './after-hours-communications-consumer';
import { processNewComputedFieldValue } from './computed-field-consumer';
import { processNotifyNoConsent } from './contact-no-consent-consumer';
import { processPatientContactEdit } from './contact-update-consumer';
import { processHelloSign } from './hello-sign-consumer';
import { processMattermost } from './mattermost-consumer';
import { processNewMemberAttributionMessage } from './member-attribution-consumer';
import { processPhoneCalls } from './phone-call-consumer';
import { processPreviousContactCheck } from './previous-contact-consumer';
import {
  processNewCalendarEventMessage,
  processNewCalendarPermissionMessage,
  processNewSchedulingMessage,
  CALENDAR_EVENT_TOPIC,
  CALENDAR_PERMISSION_TOPIC,
} from './scheduling-consumer';
import { processSmsMessages } from './sms-message-consumer';
import { processTaskEvent } from './task-event-consumer';
import { processVoicemails } from './voicemail-consumer';

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

const queue = kue.createQueue({ redis: createRedisClient() });

const logger = config.NODE_ENV === 'test' ? (console as any) : Logging.get();

const JOB_REMOVAL_TIMEOUT = 1000 * 60 * 60 * 24; // 24 hours

queue.on('error', err => {
  reportError(err, 'Kue uncaught error');
});

queue.on('job complete', id => {
  kue.Job.get(id, (_err, job) => {
    if (job) {
      setTimeout(() => {
        job.remove();
      }, JOB_REMOVAL_TIMEOUT);
    }
  });
});

queue.process('afterHoursCommunications', async (job, done) => {
  try {
    logger.log('[Consumer][afterHoursCommunications] Started processing');
    await processAfterHoursCommunications(job.data);
    logger.log('[Consumer][afterHoursCommunications] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][afterHoursCommunications] Error processing');
    reportError(err, 'Kue error afterHoursCommunications');

    return done(err);
  }
});

queue.process('computedField', async (job, done) => {
  try {
    await processNewComputedFieldValue(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

queue.process('patientContactEdit', async (job, done) => {
  try {
    logger.log('[Consumer][patientContactEdit] Started processing');
    await processPatientContactEdit(job.data);
    logger.log('[Consumer][patientContactEdit] Completed processing');
    return done();
  } catch (err) {
    logger.log('[Consumer][patientContactEdit] Error processing');
    reportError(err, 'Kue error patientContactEdit');

    return done(err);
  }
});

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

queue.process('processSmsMessages', async (job, done) => {
  try {
    logger.log('[Consumer][processSmsMessages] Started processing');
    await processSmsMessages(job.data);
    logger.log('[Consumer][processSmsMessages] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][processSmsMessages] Error processing');
    reportError(err, 'Kue error processSmsMessages');

    return done(err);
  }
});

queue.process('scheduling', async (job, done) => {
  try {
    logger.log('[Consumer][Scheduling] Started processing');
    await processNewSchedulingMessage(job.data);
    logger.log('[Consumer][Scheduling] Completed processing');
    return done();
  } catch (err) {
    logger.log('[Consumer][Scheduling] Error processing');
    reportError(err, `Kue error ${CALENDAR_PERMISSION_TOPIC}`);
    return done(err);
  }
});

queue.process(CALENDAR_PERMISSION_TOPIC, 1, async (job, done) => {
  try {
    logger.log(`[Consumer][${CALENDAR_PERMISSION_TOPIC}] Started processing`);
    await processNewCalendarPermissionMessage(job.data);
    logger.log(`[Consumer][${CALENDAR_PERMISSION_TOPIC}] Completed processing`);
    return done();
  } catch (err) {
    logger.log(`[Consumer][${CALENDAR_PERMISSION_TOPIC}] Error processing`);
    reportError(err, `Kue error ${CALENDAR_PERMISSION_TOPIC}`);
    return done(err);
  }
});

queue.process(CALENDAR_EVENT_TOPIC, async (job, done) => {
  try {
    logger.log(`[Consumer][${CALENDAR_EVENT_TOPIC}] Started processing`);
    await processNewCalendarEventMessage(job.data);
    logger.log(`[Consumer][${CALENDAR_EVENT_TOPIC}] Completed processing`);
    return done();
  } catch (err) {
    logger.log(`[Consumer][${CALENDAR_EVENT_TOPIC}] Error processing`);
    reportError(err, `Kue error ${CALENDAR_EVENT_TOPIC}`);
    return done(err);
  }
});

queue.process('checkPreviousContact', async (job, done) => {
  try {
    logger.log('[Consumer][checkPreviousContact] Started processing');
    await processPreviousContactCheck(job.data);
    logger.log('[Consumer][checkPreviousContact] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][checkPreviousContact] Error processing');
    reportError(err, 'Kue error checkPreviousContact');

    return done(err);
  }
});

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

queue.process('memberAttribution', async (job, done) => {
  try {
    await processNewMemberAttributionMessage(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

queue.process(ADD_USER_TO_CHANNEL_TOPIC, async (job, done) => {
  logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Started processing`);
  try {
    await processMattermost(job.data);
    logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Completed processing`);
    return done();
  } catch (err) {
    logger.log(`[Consumer][${ADD_USER_TO_CHANNEL_TOPIC}] Error processing`);
    reportError(err, `Kue error ${ADD_USER_TO_CHANNEL_TOPIC}`);
    return done(err);
  }
});

queue.process('processHelloSign', async (job, done) => {
  try {
    logger.log('[Consumer][processHelloSign] Started processing');
    await processHelloSign(job.data);
    logger.log('[Consumer][processHelloSign] Completed processing');

    return done();
  } catch (err) {
    logger.log('[Consumer][processHelloSign] Error processing');
    reportError(err, 'Kue error processHelloSign', job.data);

    return done(err);
  }
});
