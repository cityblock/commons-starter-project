
import { OAuth2Client } from 'google-auth-library';
import { Transaction } from 'objection';
import CareTeam from '../models/care-team';
import Patient from '../models/patient';
import PatientInfo from '../models/patient-info';
import {
  addUserToGoogleCalendar,
  createGoogleCalendarForPatient,
} from './google-calendar-helpers';

export async function createCalendarForPatient(patientId: string, userId: string, jwtClient: OAuth2Client, txn: Transaction, testConfig?: any) {
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

export async function addCareTeamToPatientCalendar(patientId: string, calendarId: string, jwtClient: OAuth2Client, txn: Transaction, testConfig?: any) {
  const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);

  const maxAttempts = 3;
  const retryInterval = 500;
  const promises = careTeamRecords.map(async record => {
    return addCareTeamUser(maxAttempts, retryInterval, {
      jwtClient,
      calendarId,
      patientId,
      userEmail: record.user.email,
      userId: record.user.id,
    }, txn);
  });

  return Promise.all(promises);
}

interface IAddMemberOptions {
  jwtClient: OAuth2Client;
  calendarId: string;
  patientId: string;
  userEmail: string;
  userId: string;
}

async function addCareTeamUser(retries: number, retryInterval: number, options: IAddMemberOptions, txn: Transaction, error?: any): Promise<void> {
  if (retries === 0) {
    return Promise.reject(
      `There was an error adding permissions for user ${options.userId} to calendar for patient, error: ${error}`,
    );
  }

  const { jwtClient, calendarId, userEmail, userId, patientId } = options;
  try {
    const aclRuleId = await addUserToGoogleCalendar(jwtClient, calendarId, userEmail);
    return CareTeam.editGoogleCalendarAclRuleId(aclRuleId, userId, patientId, txn);
  } catch (err) {
    await sleep(retryInterval);
    return addCareTeamUser(retries - 1, retryInterval * 2, options, txn, err);
  }
}

async function sleep(duration: number) {
  return new Promise<void>((resolve: () => void) => setTimeout(resolve, duration));
}
