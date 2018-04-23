import { intersection } from 'lodash';
import { ICalendarCreateEventForPatientInput, IRootMutationType, IRootQueryType } from 'schema';
import {
  createGoogleCalendarEventUrl,
  createGoogleCalendarForPatientWithTeam,
  getGoogleCalendarEventsForCurrentUser,
  getGoogleCalendarEventsForPatient,
} from '../helpers/google-calendar-helpers';
import CareTeam from '../models/care-team';
import GoogleAuth from '../models/google-auth';
import Patient from '../models/patient';
import PatientInfo from '../models/patient-info';
import User from '../models/user';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolvePatientCalendarEventsOptions {
  patientId: string;
  pageSize: number;
  pageToken: string | null;
}

export async function resolveCalendarEventsForPatient(
  source: any,
  { patientId, pageSize, pageToken }: IResolvePatientCalendarEventsOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['calendarEventsForPatient']> {
  await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

  logger.log(`GET all calendar events for patient ${patientId} by ${userId}`, 2);

  const patient = await Patient.get(patientId, txn);
  if (!patient.patientInfo.googleCalendarId) {
    return { events: [], pageInfo: { nextPageToken: null, previousPageToken: null } };
  }

  const results = await getGoogleCalendarEventsForPatient(patient.patientInfo.googleCalendarId, {
    pageToken,
    pageSize,
  });

  return {
    events: results.events,
    pageInfo: {
      nextPageToken: results.nextPageToken,
      previousPageToken: pageToken,
    },
  };
}

export interface IResolveCalendarEventsOptions {
  pageSize: number;
  pageToken: string | null;
}

export async function resolveCalendarEventsForCurrentUser(
  source: any,
  { pageSize, pageToken }: IResolveCalendarEventsOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootQueryType['calendarEventsForCurrentUser']> {
  checkLoggedInWithPermissions(userId, permissions);

  logger.log(`GET all calendar events for user ${userId}`, 2);

  const user = await User.get(userId!, txn);
  const googleAuth = await GoogleAuth.get(user.googleAuthId, txn);

  try {
    const results = await getGoogleCalendarEventsForCurrentUser(user.email, googleAuth, {
      pageToken,
      pageSize,
    });

    return {
      events: results.events,
      pageInfo: {
        nextPageToken: results.nextPageToken,
        previousPageToken: pageToken,
      },
    };
  } catch (err) {
    throw new Error(`There was an error reading the calendar for user: ${userId}`);
  }
}

export interface ICalendarCreateEventForPatientOptions {
  input: ICalendarCreateEventForPatientInput;
}

export async function calendarCreateEventForPatient(
  source: any,
  { input }: ICalendarCreateEventForPatientOptions,
  { permissions, userId, logger, txn }: IContext,
): Promise<IRootMutationType['calendarCreateEventForPatient']> {
  const { patientId, startDatetime, endDatetime, inviteeEmails, location, title, reason } = input;
  await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

  logger.log(`CREATE calendar for patient ${patientId} by ${userId}`, 2);

  const patient = await Patient.get(patientId, txn);
  let calendarId = patient.patientInfo.googleCalendarId;
  const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);
  const careTeamEmails = careTeamRecords.map(record => record.user.email);

  // disallow inviting emails of people not on a users care team
  const filteredInvitees = intersection(inviteeEmails, careTeamEmails);

  if (!calendarId) {
    try {
      const response = await createGoogleCalendarForPatientWithTeam(
        `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        careTeamEmails,
      );

      calendarId = response.data.id;
      await PatientInfo.edit(
        { updatedById: userId!, googleCalendarId: calendarId },
        patient.patientInfo.id,
        txn,
      );
    } catch (err) {
      throw new Error(`There was an error creating a calendar for patient: ${patientId}`);
    }
  }

  const eventCreateUrl = createGoogleCalendarEventUrl({
    calendarId,
    startDatetime,
    endDatetime,
    inviteeEmails: filteredInvitees,
    location,
    title,
    reason,
  });

  return { eventCreateUrl };
}
