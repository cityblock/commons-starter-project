import { OAuth2Client } from 'google-auth-library';
import { Transaction } from 'objection';
import { CALENDAR_PERMISSION_TOPIC } from '../consumers/scheduling-consumer';
import { addJobToQueue } from '../helpers/queue-helpers';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import PatientInfo from '../models/patient-info';
import {
  createGoogleCalendarAuth,
  createGoogleCalendarForPatient,
} from './google-calendar-helpers';

export async function createCalendarForPatient(
  patientId: string,
  userId: string,
  jwtClient: OAuth2Client,
  txn: Transaction,
  testConfig?: any,
) {
  const patient = await Patient.get(patientId, txn);

  const response = await createGoogleCalendarForPatient(
    jwtClient,
    `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
  );

  const calendarId = response.data.id;
  await PatientInfo.edit(
    { updatedById: userId, googleCalendarId: calendarId },
    patient.patientInfo.id,
    txn,
  );

  return calendarId;
}

export async function createCalendarWithPermissions(
  patientId: string,
  userId: string,
  txn: Transaction,
  transmissionId?: number,
  testConfig?: any,
) {
  try {
    const jwtClient = createGoogleCalendarAuth(testConfig) as any;
    const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);

    const googleCalendarId = await createCalendarForPatient(
      patientId,
      userId,
      jwtClient,
      txn,
      testConfig,
    );

    careTeamRecords.map(record => {
      return addJobToQueue(CALENDAR_PERMISSION_TOPIC, {
        userId: record.userId,
        userEmail: record.user.email,
        patientId,
        googleCalendarId,
        transmissionId,
      });
    });

    return googleCalendarId;
  } catch (err) {
    return Promise.reject(
      `There was an error creating a calendar for patient: ${patientId}. ${err}`,
    );
  }
}
