import { AxiosResponse } from 'axios';
import { addMinutes } from 'date-fns';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { get } from 'lodash';
import * as querystring from 'querystring';
import config from '../config';
import { ISchedulingMessageData } from '../handlers/pubsub/push-handler';
import GoogleAuth from '../models/google-auth';

const BASE_CREATE_URL = 'https://www.google.com/calendar/event';

export interface IMetadata {
  startDatetime: string;
  endDatetime: string;
  inviteeEmails: string[];
  location: string;
  calendarId: string;
  title: string;
  reason: string;
}

// creates a URL to prepopulate a google calendar event creation page
export function createGoogleCalendarEventUrl(metadata: IMetadata): string {
  // remove ISO string : and - as well as extra digits for timezone at the end
  const regex = /[:-]|(\.\d\d\d)/g;
  const formattedStartDatetime = metadata.startDatetime.replace(regex, '');
  const formattedEndDatetime = metadata.endDatetime.replace(regex, '');

  const dates = `${formattedStartDatetime}/${formattedEndDatetime}`;

  const params = querystring.stringify({
    action: 'TEMPLATE',
    src: metadata.calendarId,
    text: metadata.title,
    details: metadata.reason,
    location: metadata.location,
    add: metadata.inviteeEmails,
    dates,
  });

  return `${BASE_CREATE_URL}?${params}`;
}

// create a JWT auth client for service account spoofing the given subject
export function createGoogleCalendarAuth(testConfig?: any) {
  const finalConfig = testConfig || config;
  const credentials = JSON.parse(finalConfig.GCP_CREDS || '');

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject:
      testConfig && testConfig.subject
        ? testConfig.subject
        : 'cristina@testorg.cityblock.engineering',
  });
}

interface ICalendar {
  id: string;
}

export async function createGoogleCalendarForPatient(
  jwtClient: OAuth2Client,
  calendarName: string,
): Promise<AxiosResponse<ICalendar>> {
  const calendar = google.calendar({ version: 'v3' });
  return calendar.calendars.insert({
    auth: jwtClient,
    resource: {
      summary: calendarName,
    },
  });
}

export async function addUserToGoogleCalendar(
  jwtClient: OAuth2Client,
  calendarId: string,
  userEmail: string,
) {
  const calendar = google.calendar({ version: 'v3' });

  const response = await calendar.acl.insert({
    auth: jwtClient,
    calendarId,
    resource: {
      role: 'writer',
      scope: {
        type: 'user',
        value: userEmail,
      },
    },
  });

  return response.data.id;
}

export async function deleteUserFromGoogleCalendar(
  jwtClient: OAuth2Client,
  calendarId: string,
  googleCalendarAclRuleId: string,
): Promise<AxiosResponse<any>> {
  const calendar = google.calendar({ version: 'v3' });

  return calendar.acl.delete({
    auth: jwtClient,
    calendarId,
    ruleId: googleCalendarAclRuleId,
  });
}

export interface IGooglePaginationOptions {
  pageToken: string | null;
  pageSize: number;
}

export async function getGoogleCalendarEventsForPatient(
  calendarId: string,
  pageOptions: IGooglePaginationOptions,
  testConfig?: any,
) {
  const jwtClient = createGoogleCalendarAuth(testConfig) as any;
  return getGoogleCalendarEvents(calendarId, jwtClient, pageOptions, testConfig);
}

export async function getGoogleCalendarEventsForCurrentUser(
  calendarId: string,
  googleAuth: GoogleAuth,
  pageOptions: IGooglePaginationOptions,
  testConfig?: any,
) {
  const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_OAUTH_TOKEN as any,
    config.GOOGLE_OAUTH_SECRET as any,
    config.GOOGLE_OAUTH_REDIRECT_URI,
  );

  oauth2Client.setCredentials({
    access_token: googleAuth.accessToken,
    refresh_token: googleAuth.refreshToken,
    expiry_date: new Date(googleAuth.expiresAt).valueOf(),
  });

  return getGoogleCalendarEvents(calendarId, oauth2Client, pageOptions, testConfig);
}

export async function createGoogleCalendarEvent(
  calendarId: string,
  resource: { [key: string]: any },
  testConfig?: any,
): Promise<AxiosResponse<ICalendar>> {
  const jwtClient = createGoogleCalendarAuth(testConfig) as any;

  const calendar = google.calendar({ version: 'v3' });
  return calendar.events.insert({
    auth: jwtClient,
    calendarId,
    resource,
  });
}

export async function updateGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  resource: { [key: string]: any },
  testConfig?: any,
): Promise<AxiosResponse<ICalendar>> {
  const jwtClient = createGoogleCalendarAuth(testConfig) as any;

  const calendar = google.calendar({ version: 'v3' });
  return calendar.events.update({
    auth: jwtClient,
    calendarId,
    eventId,
    resource,
  });
}

export async function deleteGoogleCalendarEvent(
  calendarId: string,
  eventId: string,
  testConfig?: any,
): Promise<AxiosResponse> {
  const jwtClient = createGoogleCalendarAuth(testConfig) as any;

  const calendar = google.calendar({ version: 'v3' });
  return calendar.events.delete({
    auth: jwtClient,
    calendarId,
    eventId,
  });
}

export function getGoogleCalendarFieldsFromSIU(data: ISchedulingMessageData) {
  const endTime = addMinutes(data.dateTime, data.duration).toISOString();
  const { provider } = data;
  const providerName = provider
    ? [provider.firstName, provider.lastName].filter(Boolean).join(' ')
    : null;
  const providerCredentials =
    provider && provider.credentials ? provider.credentials.join(', ') : null;

  return {
    start: { dateTime: data.dateTime },
    end: { dateTime: endTime },
    location: data.facility,
    description: data.instructions ? data.instructions.join('\n') : null,
    summary: `[EPIC] ${data.facilityDepartment}`,
    extendedProperties: {
      shared: {
        generatedBy: 'siu',
        providerName,
        providerCredentials,
      },
    },
  };
}

async function getGoogleCalendarEvents(
  calendarId: string,
  auth: any,
  { pageToken, pageSize }: IGooglePaginationOptions,
  testConfig?: any,
) {
  const calendar = google.calendar({ version: 'v3' });
  const response = await calendar.events.list({
    auth,
    calendarId,
    maxResults: pageSize,
    singleEvents: true,
    orderBy: 'startTime',
    timeMin: new Date().toISOString(),
    pageToken,
  });

  const events = response.data.items.map(item => {
    return {
      id: item.id,
      title: item.summary,
      startDate: item.start.dateTime || item.start.date,
      startTime: item.start.dateTime,
      endDate: item.end.dateTime || item.end.date,
      endTime: item.end.dateTime,
      status: item.status,
      htmlLink: item.htmlLink,
      description: item.description,
      guests: (item.attendees || []).map(attendee => attendee.displayName || attendee.email),
      eventType: get(item, 'extendedProperties.shared.generatedBy') || 'cityblock',
      providerName: get(item, 'extendedProperties.shared.providerName'),
      providerCredentials: get(item, 'extendedProperties.shared.providerCredentials'),
    };
  });

  return {
    events,
    nextPageToken: response.data.nextPageToken,
  };
}
