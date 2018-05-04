/**
 * @jest-environment node
 */

import { addMinutes } from 'date-fns';
import { graphql, print } from 'graphql';
import { cloneDeep } from 'lodash';
import * as nock from 'nock';
import { transaction, Transaction } from 'objection';
import * as calendarCreateEventForPatient from '../../../app/graphql/queries/calendar-create-event-for-patient-mutation.graphql';
import * as calendarCreateForPatient from '../../../app/graphql/queries/calendar-create-for-patient-mutation.graphql';
import Db from '../../db';
import {
  createGoogleCalendarEventUrl,
} from '../../helpers/google-calendar-helpers';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import User from '../../models/user';
import { createMockClinic, createMockUser, createPatient, mockGoogleCredentials, mockGoogleOauthAuthorize } from '../../spec-helpers';
import schema from '../make-executable-schema';

interface ISetup {
  user: User;
  patient: Patient;
  clinic: Clinic;
}

const userRole = 'admin';
const permissions = 'green';

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
  let db: Db;
  const log = jest.fn();
  const logger = { log };
  const calendarCreateEventForPatientMutation = print(calendarCreateEventForPatient);
  const calendarCreateForPatientMutation = print(calendarCreateForPatient);

  beforeEach(async () => {
    db = await Db.get();
    txn = await transaction.start(User.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
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
          db,
          permissions,
          userId: user.id,
          logger,
          txn,
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

    it('can create a clendar for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeGoogleCalId';
      const cityblockToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3MDI4OTBmY2RkODU4Yzg5ZDlhMzFmNTAyYjQxOWNhYTg2MWE0NzkifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAxNTU4MjI3Mzk3MzY1Mzk4NjkiLCJoZCI6ImNpdHlibG9jay5jb20iLCJlbWFpbCI6ImxvZ2FuQGNpdHlibG9jay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InE3ZVVNVzhYV0Y5eHc0NUNxTXJqZlEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTcyNzk4MDAsImV4cCI6MTQ5NzI4MzQwMCwibmFtZSI6IkxvZ2FuIEhhc3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVBBZElibFBfWkowL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FBeVlCRjc0V2FfZUxJSGRMYzItODhBVDdmZ1Y4NlpDSWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkxvZ2FuIiwiZmFtaWx5X25hbWUiOiJIYXNzb24iLCJsb2NhbGUiOiJlbiJ9.AlKDr4beAw7nTTuebFHCS-Mi6VCBPCn3fERief9Itl4gtxY8j5rZgvyjSprplbFbwDCOF_YW4YJB4BcHmKCEbw0TXvGPjPla84U7GJZvKxKSAh2oyYW6aJGGKK_CY5AH5GLAmgzg_3TuuF026YAHzpEYTQSPRG28LCJxGhNiMKPEdQi7D7r85aCE0CbhGOvFClaoyrLRMeEgvbkskVcl1xRvhzdxee974k92T10kjScRPQRPdjs98i3EFXO4IYwh5c0k7eg-0LkJgddJARM5FN4UN8Cu1VsKZhjsoh2WNLpQ8CLHtiC7ov24WOb2dSZNOCqX1NB2A2cmMDrWvKRMiw`;
      mockGoogleOauthAuthorize(cityblockToken);

      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', { summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]` })
        .reply(200, {
          id: googleCalendarId,
        });

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/acl`)
        .post('', {role: 'writer', scope: { type: 'user', value: user.email }})
        .reply(200, {});

      const testConfig = mockGoogleCredentials();

      const result = await graphql(
        schema,
        calendarCreateForPatientMutation,
        null,
        {
          db,
          permissions,
          userId: user.id,
          logger,
          testConfig,
          txn,
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
  });
});
