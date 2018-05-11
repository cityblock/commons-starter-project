import * as dotenv from 'dotenv';
dotenv.config();

import * as Knex from 'knex';
import * as kue from 'kue';
import { transaction, Model, Transaction } from 'objection';
import config from '../config';
import { ISchedulingMessageData } from '../handlers/pubsub/push-handler';
import {
  createGoogleCalendarAuth,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  getGoogleCalendarFieldsFromSIU,
  updateGoogleCalendarEvent,
} from '../helpers/google-calendar-helpers';
import {
  addCareTeamToPatientCalendar,
  createCalendarForPatient,
} from '../helpers/patient-calendar-helpers';
import { createRedisClient } from '../lib/redis';
import Patient from '../models/patient';
import PatientSiuEvent from '../models/patient-siu-event';
import User from '../models/user';

const queue = kue.createQueue({ redis: createRedisClient() });

/* tslint:disable no-var-requires */
const knexConfig = require('./models/knexfile');
/* tslint:enable no-var-requires */

const knex = Knex(knexConfig[config.NODE_ENV || 'development']);
Model.knex(knex);

queue.process('scheduling', async (job, done) => {
  try {
    await processNewSchedulingMessage(job.data);
    return done();
  } catch (err) {
    return done(err);
  }
});

/* tslint:disable:no-console */
queue.on('error', err => {
  console.log(`Kue error: ${err}`);
});
/* tslint:enable:no-console */

export async function processNewSchedulingMessage(
  data: ISchedulingMessageData,
  existingTxn?: Transaction,
  testConfig?: any,
) {
  // Note: existingTxn is only for use in tests
  const { patientId, eventType, transmissionId, visitId, dateTime, duration } = data;

  // TODO: Make this less strict
  if (!patientId || !eventType || !transmissionId || !visitId || !dateTime || !duration) {
    return Promise.reject(
      'Missing either patientId, eventType, transmissionId, visitId, dateTime, or duration',
    );
  }

  await transaction(existingTxn || PatientSiuEvent.knex(), async txn => {
    const siuEvent = await PatientSiuEvent.getByVisitId(visitId, txn);
    const patient = await Patient.get(patientId, txn);

    const jwtClient = createGoogleCalendarAuth(testConfig) as any;
    let { googleCalendarId } = patient.patientInfo;
    if (!googleCalendarId) {
      try {
        const attributionUser = await User.findOrCreateAttributionUser(txn);

        googleCalendarId = await createCalendarForPatient(
          patient.id,
          attributionUser.id,
          jwtClient,
          txn,
          testConfig,
        );
        await addCareTeamToPatientCalendar(
          patient.id,
          googleCalendarId,
          jwtClient,
          txn,
          testConfig,
        );
      } catch (err) {
        return Promise.reject(
          `There was an error creating a calendar for patient: ${patientId}. ${err}`,
        );
      }
    }

    if (siuEvent) {
      // If a event exists and the siu update is a later transmission than the last, update it
      if (transmissionId <= siuEvent.transmissionId) {
        return;
      }

      if (eventType === 'Reschedule' || eventType === 'Modification') {
        const calendarFields = getGoogleCalendarFieldsFromSIU(data);

        await updateGoogleCalendarEvent(
          jwtClient,
          googleCalendarId,
          siuEvent.googleEventId,
          calendarFields,
        );

        await PatientSiuEvent.edit(siuEvent.id, { transmissionId }, txn);
      } else if (eventType === 'Cancel') {
        await deleteGoogleCalendarEvent(jwtClient, googleCalendarId, siuEvent.googleEventId);

        await PatientSiuEvent.edit(
          siuEvent.id,
          { transmissionId, deletedAt: new Date().toISOString() },
          txn,
        );
      }
    } else {
      const calendarFields = getGoogleCalendarFieldsFromSIU(data);

      const response = await createGoogleCalendarEvent(
        jwtClient,
        googleCalendarId,
        calendarFields,
        testConfig,
      );
      const deletedAt = eventType === 'Cancel' ? new Date().toISOString() : undefined;
      await PatientSiuEvent.create(
        {
          visitId,
          patientId,
          transmissionId,
          googleEventId: response.data.id,
          deletedAt,
        },
        txn,
      );
    }
  });
}
