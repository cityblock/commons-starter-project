import { intersection } from 'lodash';
import { transaction } from 'objection';
import {
  ICalendarCreateEventForCurrentUserInput,
  ICalendarCreateEventForPatientInput,
  ICalendarCreateForPatientInput,
  IRootMutationType,
  IRootQueryType,
} from 'schema';
import {
  createGoogleCalendarEventUrl,
  getGoogleCalendarEventsForCurrentUser,
  getGoogleCalendarEventsForPatient,
  getGoogleCalendarUrl,
} from '../helpers/google-calendar-helpers';
import { createCalendarWithPermissions } from '../helpers/patient-calendar-helpers';
import CareTeam from '../models/care-team';
import GoogleAuth from '../models/google-auth';
import Patient from '../models/patient';
import User from '../models/user';
import checkUserPermissions, { checkLoggedInWithPermissions } from './shared/permissions-check';
import { IContext } from './shared/utils';

export interface IResolvePatientCalendarOptions {
  patientId: string;
}

export async function resolveCalendarForPatient(
  source: any,
  { patientId }: IResolvePatientCalendarOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['calendarForPatient']> {
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET calendar id for patient ${patientId} by ${userId}`);

    const patient = await Patient.get(patientId, txn);
    const { googleCalendarId } = patient.patientInfo;
    const googleCalendarUrl = getGoogleCalendarUrl(googleCalendarId);
    return { patientId, googleCalendarId, googleCalendarUrl };
  });
}

export async function resolveCalendarForCurrentUser(
  source: any,
  {  }: any,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootQueryType['calendarForCurrentUser']> {
  checkLoggedInWithPermissions(userId, permissions);

  logger.log(`GET calendar for user ${userId}`);

  return transaction(testTransaction || Patient.knex(), async txn => {
    const user = await User.get(userId!, txn);
    const googleCalendarId = user.email;
    const googleCalendarUrl = getGoogleCalendarUrl(googleCalendarId);
    return { googleCalendarId, googleCalendarUrl };
  });
}

export interface IResolvePatientCalendarEventsOptions {
  patientId: string;
  timeMin: string;
  pageSize: number;
  pageToken: string | null;
}

export async function resolveCalendarEventsForPatient(
  source: any,
  { patientId, timeMin, pageSize, pageToken }: IResolvePatientCalendarEventsOptions,
  { permissions, userId, logger, testConfig, testTransaction }: IContext,
): Promise<IRootQueryType['calendarEventsForPatient']> {
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'view', 'patient', txn, patientId);

    logger.log(`GET all calendar events for patient ${patientId} by ${userId}`);

    const patient = await Patient.get(patientId, txn);
    if (!patient.patientInfo.googleCalendarId) {
      return { events: [], pageInfo: { nextPageToken: null, previousPageToken: null } };
    }

    const results = await getGoogleCalendarEventsForPatient(
      { calendarId: patient.patientInfo.googleCalendarId, timeMin },
      { pageToken, pageSize },
      testConfig,
    );

    return {
      events: results.events,
      pageInfo: {
        nextPageToken: results.nextPageToken,
        previousPageToken: pageToken,
      },
    };
  });
}

export interface IResolveCalendarEventsOptions {
  timeMin: string;
  pageSize: number;
  pageToken: string | null;
}

export async function resolveCalendarEventsForCurrentUser(
  source: any,
  { timeMin, pageSize, pageToken }: IResolveCalendarEventsOptions,
  { permissions, userId, logger, testConfig, testTransaction }: IContext,
): Promise<IRootQueryType['calendarEventsForCurrentUser']> {
  checkLoggedInWithPermissions(userId, permissions);

  logger.log(`GET all calendar events for user ${userId}`);

  return transaction(testTransaction || Patient.knex(), async txn => {
    const user = await User.get(userId!, txn);
    const googleAuth = await GoogleAuth.get(user.googleAuthId, txn);

    try {
      const results = await getGoogleCalendarEventsForCurrentUser(
        { calendarId: user.email, timeMin },
        googleAuth,
        {
          pageToken,
          pageSize,
        },
        testConfig,
      );

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
  });
}

export interface ICalendarCreateEventForPatientOptions {
  input: ICalendarCreateEventForPatientInput;
}

export async function calendarCreateEventForPatient(
  source: any,
  { input }: ICalendarCreateEventForPatientOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['calendarCreateEventForPatient']> {
  const {
    patientId,
    startDatetime,
    endDatetime,
    inviteeEmails,
    location,
    title,
    reason,
    googleCalendarId,
  } = input;
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

    logger.log(`CREATE calendar for patient ${patientId} by ${userId}`);

    const careTeamRecords = await CareTeam.getCareTeamRecordsForPatient(patientId, txn);
    const careTeamEmails = careTeamRecords.map(record => record.user.email);

    // disallow inviting emails of people not on a users care team
    const filteredInvitees = intersection(inviteeEmails, careTeamEmails);

    const eventCreateUrl = createGoogleCalendarEventUrl({
      calendarId: googleCalendarId,
      startDatetime,
      endDatetime,
      inviteeEmails: filteredInvitees,
      location,
      title,
      reason,
    });

    return { eventCreateUrl };
  });
}

export interface ICalendarCreateForPatientOptions {
  input: ICalendarCreateForPatientInput;
}

export async function calendarCreateForPatient(
  source: any,
  { input }: ICalendarCreateForPatientOptions,
  { permissions, userId, logger, testConfig, testTransaction }: IContext,
): Promise<IRootMutationType['calendarCreateForPatient']> {
  const { patientId } = input;
  return transaction(testTransaction || Patient.knex(), async txn => {
    await checkUserPermissions(userId, permissions, 'edit', 'patient', txn, patientId);

    logger.log(`CREATE calendar for patient ${patientId} by ${userId}`);

    const patient = await Patient.get(patientId, txn);
    let calendarId = patient.patientInfo.googleCalendarId;

    if (!calendarId) {
      try {
        calendarId = await createCalendarWithPermissions(patient.id, userId!, txn, undefined, testConfig);
      } catch (err) {
        throw new Error(`There was an error creating a calendar for patient: ${patientId}. ${err}`);
      }
    }

    const googleCalendarUrl = getGoogleCalendarUrl(calendarId);
    return { googleCalendarId: calendarId, googleCalendarUrl, patientId };
  });
}

export interface ICalendarCreateEventForCurrentUserOptions {
  input: ICalendarCreateEventForCurrentUserInput;
}

export async function calendarCreateEventForCurrentUser(
  source: any,
  { input }: ICalendarCreateEventForCurrentUserOptions,
  { permissions, userId, logger, testTransaction }: IContext,
): Promise<IRootMutationType['calendarCreateEventForCurrentUser']> {
  const { startDatetime, endDatetime, inviteeEmails, location, title, reason } = input;
  checkLoggedInWithPermissions(userId, permissions);

  logger.log(`CREATE calendar event for current user ${userId}`);

  return transaction(testTransaction || Patient.knex(), async txn => {
    const user = await User.get(userId!, txn);

    const eventCreateUrl = createGoogleCalendarEventUrl({
      calendarId: user.email,
      startDatetime,
      endDatetime,
      inviteeEmails,
      location,
      title,
      reason,
    });

    return { eventCreateUrl };
  });
}
