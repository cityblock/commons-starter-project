import { AxiosResponse } from 'axios';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import * as querystring from 'querystring';
import config from '../config';

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
export function createGoogleCalendarAuth(subject?: string, testConfig?: any) {
  const finalConfig = testConfig || config;
  const credentials = JSON.parse(finalConfig.GCP_CREDS || '');

  return new google.auth.JWT({
    email: credentials.client_email,
    key: credentials.private_key,
    scopes: ['https://www.googleapis.com/auth/calendar'],
    subject,
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
  return calendar.calendars.insert(
    {
      auth: jwtClient,
      resource: {
        summary: calendarName,
      },
    },
  );
}

export async function addUserToGoogleCalendar(
  jwtClient: OAuth2Client,
  calendarId: string,
  userEmail: string,
): Promise<AxiosResponse<any>> {
  const calendar = google.calendar({ version: 'v3' });

  return calendar.acl.insert(
    {
      auth: jwtClient,
      calendarId,
      resource: {
        role: 'writer',
        scope: {
          type: 'user',
          value: userEmail,
        },
      },
    },
  );
}

export async function createGoogleCalendarForPatientWithTeam(
  calendarName: string,
  userEmails: string[],
  testConfig?: any,
) {
  // TODO: have the email change to whatever we use for calendars long term
  const jwtClient = createGoogleCalendarAuth(
    'cristina@testorg.cityblock.engineering',
    testConfig,
  ) as any;

  const response = await createGoogleCalendarForPatient(jwtClient, calendarName);
  const calendarId = response.data.id;
  const promises = userEmails.map(async email => addUserToGoogleCalendar(jwtClient, calendarId, email));
  await Promise.all(promises);

  return response;
}
