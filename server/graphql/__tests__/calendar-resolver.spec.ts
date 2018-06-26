/**
 * @jest-environment node
 */

import { addMinutes } from 'date-fns';
import { graphql, print } from 'graphql';
import kue from 'kue';
import { cloneDeep } from 'lodash';
import nock from 'nock';
import { transaction, Transaction } from 'objection';
import { Permissions, UserRole } from 'schema';
import calendarCreateEventForCurrentUser from '../../../app/graphql/queries/calendar-create-event-for-current-user-mutation.graphql';
import calendarCreateEventForPatient from '../../../app/graphql/queries/calendar-create-event-for-patient-mutation.graphql';
import calendarCreateForPatient from '../../../app/graphql/queries/calendar-create-for-patient-mutation.graphql';
import getCalendarEventsForCurrentUser from '../../../app/graphql/queries/get-calendar-events-for-current-user.graphql';
import getCalendarEventsForPatient from '../../../app/graphql/queries/get-calendar-events-for-patient.graphql';
import getCalendarForPatient from '../../../app/graphql/queries/get-calendar-for-patient.graphql';
import { createGoogleCalendarEventUrl } from '../../helpers/google-calendar-helpers';
import Clinic from '../../models/clinic';
import GoogleAuth from '../../models/google-auth';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import User from '../../models/user';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  mockGoogleCredentials,
  mockGoogleOauthAuthorize,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

const queue = kue.createQueue();

interface ISetup {
  user: User;
  patient: Patient;
  clinic: Clinic;
}

const userRole = 'Pharmacist' as UserRole;
const permissions = 'green' as Permissions;
const cityblockToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3MDI4OTBmY2RkODU4Yzg5ZDlhMzFmNTAyYjQxOWNhYTg2MWE0NzkifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAxNTU4MjI3Mzk3MzY1Mzk4NjkiLCJoZCI6ImNpdHlibG9jay5jb20iLCJlbWFpbCI6ImxvZ2FuQGNpdHlibG9jay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InE3ZVVNVzhYV0Y5eHc0NUNxTXJqZlEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTcyNzk4MDAsImV4cCI6MTQ5NzI4MzQwMCwibmFtZSI6IkxvZ2FuIEhhc3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVBBZElibFBfWkowL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FBeVlCRjc0V2FfZUxJSGRMYzItODhBVDdmZ1Y4NlpDSWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkxvZ2FuIiwiZmFtaWx5X25hbWUiOiJIYXNzb24iLCJsb2NhbGUiOiJlbiJ9.AlKDr4beAw7nTTuebFHCS-Mi6VCBPCn3fERief9Itl4gtxY8j5rZgvyjSprplbFbwDCOF_YW4YJB4BcHmKCEbw0TXvGPjPla84U7GJZvKxKSAh2oyYW6aJGGKK_CY5AH5GLAmgzg_3TuuF026YAHzpEYTQSPRG28LCJxGhNiMKPEdQi7D7r85aCE0CbhGOvFClaoyrLRMeEgvbkskVcl1xRvhzdxee974k92T10kjScRPQRPdjs98i3EFXO4IYwh5c0k7eg-0LkJgddJARM5FN4UN8Cu1VsKZhjsoh2WNLpQ8CLHtiC7ov24WOb2dSZNOCqX1NB2A2cmMDrWvKRMiw`;

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient(
    { cityblockId: 123, homeClinicId: clinic.id, userId: user.id },
    txn,
  );

  return {
    clinic,
    user,
    patient,
  };
}

describe('calendar tests', () => {
  let txn = null as any;

  const log = jest.fn();
  const logger = { log };
  const calendarCreateEventForCurrentUserMutation = print(calendarCreateEventForCurrentUser);
  const calendarCreateEventForPatientMutation = print(calendarCreateEventForPatient);
  const calendarCreateForPatientMutation = print(calendarCreateForPatient);
  const getCalendarEventsForCurrentUserQuery = print(getCalendarEventsForCurrentUser);
  const getCalendarEventsForPatientQuery = print(getCalendarEventsForPatient);
  const getCalendarForPatientQuery = print(getCalendarForPatient);

  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();

    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  describe('calendar for patient', () => {
    it('can create an event for a patient who has a calendar', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeGoogleCalId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const startDatetime = new Date().toISOString();
      const endDatetime = addMinutes(startDatetime, 30).toISOString();
      const location = 'cityblock HQ';
      const title = 'some appointment';
      const reason = 'some description';
      const email = 'test@email.com';

      const result = await graphql(
        schema,
        calendarCreateEventForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
          startDatetime,
          endDatetime,
          inviteeEmails: [email],
          location,
          title,
          reason,
          googleCalendarId,
        },
      );

      const expectedEventCreateUrl = createGoogleCalendarEventUrl({
        calendarId: googleCalendarId,
        startDatetime,
        endDatetime,
        inviteeEmails: [],
        location,
        title,
        reason,
      });

      expect(cloneDeep(result.data!.calendarCreateEventForPatient)).toMatchObject({
        eventCreateUrl: expectedEventCreateUrl,
      });
    });

    it('can create a calendar for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeGoogleCalId';
      mockGoogleOauthAuthorize(cityblockToken);

      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', {
          summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        })
        .reply(200, {
          id: googleCalendarId,
        });

      const testConfig = mockGoogleCredentials();

      const result = await graphql(
        schema,
        calendarCreateForPatientMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testConfig,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.calendarCreateForPatient)).toMatchObject({
        patientId: patient.id,
        googleCalendarId,
      });
    });

    it('can get a calendar for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeGoogleCalId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const result = await graphql(
        schema,
        getCalendarForPatientQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          patientId: patient.id,
        },
      );

      expect(cloneDeep(result.data!.calendarForPatient)).toMatchObject({
        patientId: patient.id,
        googleCalendarId,
      });
    });

    it('it can read all the calendar events for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeGoogleCalId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      const now = new Date().toISOString();
      const startDatetime = addMinutes(now, 30).toISOString();
      const endDatetime = addMinutes(startDatetime, 60).toISOString();
      const eventId = 'id0';
      const summary = 'title';
      const status = 'confirmed';
      const htmlLink = 'http://googlecalendar.com/id0';
      const description = 'event description';
      const attendeeName = 'First Person';
      const attendeeEmail = 'secondperson@gmail.com';
      const generatedBy = 'cityblock';
      const nextPageToken = '12345';

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .get('')
        .query({
          maxResults: 20,
          singleEvents: true,
          orderBy: 'startTime',
          timeMin: now,
        })
        .reply(200, {
          items: [
            {
              id: eventId,
              summary,
              start: { dateTime: startDatetime },
              end: { dateTime: endDatetime },
              status,
              htmlLink,
              description,
              attendees: [
                { email: 'firstperson@gmail.com', displayName: attendeeName },
                { email: attendeeEmail },
              ],
              extendedProperties: { shared: { generatedBy } },
            },
          ],
          nextPageToken,
        });

      const testConfig = mockGoogleCredentials();

      const result = await graphql(
        schema,
        getCalendarEventsForPatientQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testConfig,
          testTransaction: txn,
        },
        {
          timeMin: now,
          patientId: patient.id,
          pageSize: 20,
        },
      );

      expect(cloneDeep(result.data!.calendarEventsForPatient)).toMatchObject({
        events: [
          {
            id: eventId,
            title: summary,
            startDate: startDatetime,
            startTime: startDatetime,
            endDate: endDatetime,
            endTime: endDatetime,
            htmlLink,
            description,
            guests: [attendeeName, attendeeEmail],
            eventType: generatedBy,
            providerName: null,
            providerCredentials: null,
          },
        ],
        pageInfo: { nextPageToken, previousPageToken: null },
      });
    });
  });

  describe('calendar for current user', () => {
    it('can create an event for the current user', async () => {
      const { user } = await setup(txn);

      const startDatetime = new Date().toISOString();
      const endDatetime = addMinutes(startDatetime, 30).toISOString();
      const location = 'cityblock HQ';
      const title = 'some appointment';
      const reason = 'some description';
      const email = 'test@email.com';

      const result = await graphql(
        schema,
        calendarCreateEventForCurrentUserMutation,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testTransaction: txn,
        },
        {
          startDatetime,
          endDatetime,
          inviteeEmails: [email],
          location,
          title,
          reason,
        },
      );

      const expectedEventCreateUrl = createGoogleCalendarEventUrl({
        calendarId: user.email,
        startDatetime,
        endDatetime,
        inviteeEmails: [email],
        location,
        title,
        reason,
      });

      expect(cloneDeep(result.data!.calendarCreateEventForCurrentUser)).toMatchObject({
        eventCreateUrl: expectedEventCreateUrl,
      });
    });

    it('can read all the calendar events for the current user', async () => {
      const { user } = await setup(txn);
      const now = new Date().toISOString();
      const startDatetime = addMinutes(now, 30).toISOString();
      const endDatetime = addMinutes(startDatetime, 60).toISOString();

      const googleAuth = await GoogleAuth.updateOrCreate(
        {
          accessToken: 'faketoken',
          refreshToken: 'fakerefresh',
          expiresAt: startDatetime,
          userId: user.id,
        },
        txn,
      );
      await User.update(user.id, { googleAuthId: googleAuth.id }, txn);

      mockGoogleOauthAuthorize(cityblockToken);

      const eventId = 'id0';
      const summary = 'title';
      const status = 'confirmed';
      const htmlLink = 'http://googlecalendar.com/id0';
      const description = 'event description';
      const attendeeName = 'First Person';
      const attendeeEmail = 'secondperson@gmail.com';
      const generatedBy = 'cityblock';
      const nextPageToken = '12345';

      nock(`https://www.googleapis.com/calendar/v3/calendars/a%40b.com/events`)
        .get('')
        .query({
          maxResults: 20,
          singleEvents: true,
          orderBy: 'startTime',
          timeMin: now,
        })
        .reply(200, {
          items: [
            {
              id: eventId,
              summary,
              start: { dateTime: startDatetime },
              end: { dateTime: endDatetime },
              status,
              htmlLink,
              description,
              attendees: [
                { email: 'firstperson@gmail.com', displayName: attendeeName },
                { email: attendeeEmail },
              ],
              extendedProperties: { shared: { generatedBy } },
            },
          ],
          nextPageToken,
        });

      const testConfig = mockGoogleCredentials();

      const result = await graphql(
        schema,
        getCalendarEventsForCurrentUserQuery,
        null,
        {
          permissions,
          userId: user.id,
          logger,
          testConfig,
          testTransaction: txn,
        },
        {
          timeMin: now,
          pageSize: 20,
        },
      );

      expect(cloneDeep(result.data!.calendarEventsForCurrentUser)).toMatchObject({
        events: [
          {
            id: eventId,
            title: summary,
            startDate: startDatetime,
            startTime: startDatetime,
            endDate: endDatetime,
            endTime: endDatetime,
            htmlLink,
            description,
            guests: [attendeeName, attendeeEmail],
            eventType: generatedBy,
            providerName: null,
            providerCredentials: null,
          },
        ],
        pageInfo: { nextPageToken, previousPageToken: null },
      });
    });
  });
});
