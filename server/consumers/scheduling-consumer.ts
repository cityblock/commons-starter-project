import { transaction, Transaction } from 'objection';
import { ISchedulingMessageData } from '../handlers/pubsub/push-handler';
import {
  addUserToGoogleCalendar,
  createGoogleCalendarAuth,
  createGoogleCalendarEvent,
  deleteGoogleCalendarEvent,
  getGoogleCalendarFieldsFromSIU,
  updateGoogleCalendarEvent,
} from '../helpers/google-calendar-helpers';
import { createCalendarWithPermissions } from '../helpers/patient-calendar-helpers';
import queueHelpers from '../helpers/queue-helpers';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import PatientSiuEvent from '../models/patient-siu-event';
import User from '../models/user';

export const CALENDAR_PERMISSION_TOPIC = 'calendarPermission';
export const CALENDAR_EVENT_TOPIC = 'calendarEvent';

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

  await transaction(existingTxn || CareTeam.knex(), async txn => {
    const patient = await Patient.get(patientId, txn);
    let { googleCalendarId } = patient.patientInfo;

    if (!googleCalendarId) {
      const attributionUser = await User.findOrCreateAttributionUser(txn);
      googleCalendarId = await createCalendarWithPermissions(
        patient.id,
        attributionUser.id,
        txn,
        data.transmissionId,
        testConfig,
      );
    }

    try {
      return queueHelpers.addJobToQueue(CALENDAR_EVENT_TOPIC, {
        ...data,
        googleCalendarId,
      });
    } catch (err) {
      return Promise.reject(
        `There was an error creating a calendar event for patient: ${patientId}. ${err}`,
      );
    }
  });
}

interface ICalendarPermissionMessageData {
  patientId: string;
  userId: string;
  googleCalendarId: string;
  userEmail: string;
  transmissionId: number;
}

export async function processNewCalendarPermissionMessage(
  data: ICalendarPermissionMessageData,
  existingTxn?: Transaction,
  testConfig?: any,
) {
  // Note: existingTxn is only for use in tests
  const { patientId, userId, googleCalendarId, userEmail } = data;

  await transaction(existingTxn || CareTeam.knex(), async txn => {
    const jwtClient = createGoogleCalendarAuth(testConfig) as any;

    try {
      const aclRuleId = await addUserToGoogleCalendar(jwtClient, googleCalendarId, userEmail);
      return CareTeam.editGoogleCalendarAclRuleId(aclRuleId, userId, patientId, txn);
    } catch (err) {
      return Promise.reject(
        `There was an error adding a calendar permission for patient: ${patientId}. ${err}`,
      );
    }
  });
}

interface ICalendarEventMessageData extends ISchedulingMessageData {
  googleCalendarId: string;
}

export async function processNewCalendarEventMessage(
  data: ICalendarEventMessageData,
  existingTxn?: Transaction,
  testConfig?: any,
) {
  const { patientId, eventType, transmissionId, visitId, googleCalendarId } = data;

  // Note: existingTxn is only for use in tests
  await transaction(existingTxn || PatientSiuEvent.knex(), async txn => {
    const siuEvent = await PatientSiuEvent.getByVisitId(visitId, txn);

    const jwtClient = createGoogleCalendarAuth(testConfig) as any;

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

        return PatientSiuEvent.edit(siuEvent.id, { transmissionId }, txn);
      } else if (eventType === 'Cancel') {
        await deleteGoogleCalendarEvent(jwtClient, googleCalendarId, siuEvent.googleEventId);

        return PatientSiuEvent.edit(
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
      return PatientSiuEvent.create(
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
