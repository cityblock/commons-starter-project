/**
 * @jest-environment node
 */

import kue from 'kue';
import nock from 'nock';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';

import { getGoogleCalendarFieldsFromSIU } from '../../helpers/google-calendar-helpers';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import PatientInfo from '../../models/patient-info';
import PatientSiuEvent from '../../models/patient-siu-event';
import User from '../../models/user';
import {
  createMockClinic,
  createMockSiuMessage,
  createMockUser,
  createPatient,
  mockGoogleCredentials,
  mockGoogleOauthAuthorize,
} from '../../spec-helpers';
import { processNewSchedulingMessage } from '../scheduling-consumer';

const queue = kue.createQueue();

const userRole = 'admin' as UserRole;
const cityblockToken = `eyJhbGciOiJSUzI1NiIsImtpZCI6ImY3MDI4OTBmY2RkODU4Yzg5ZDlhMzFmNTAyYjQxOWNhYTg2MWE0NzkifQ.eyJhenAiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI0NTMwMTk2ODQwMjItN2hwdDB2Zms5YmpqYzUzcG0ycmw5ZjF2Z211amtsNjguYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMDAxNTU4MjI3Mzk3MzY1Mzk4NjkiLCJoZCI6ImNpdHlibG9jay5jb20iLCJlbWFpbCI6ImxvZ2FuQGNpdHlibG9jay5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwiYXRfaGFzaCI6InE3ZVVNVzhYV0Y5eHc0NUNxTXJqZlEiLCJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJpYXQiOjE0OTcyNzk4MDAsImV4cCI6MTQ5NzI4MzQwMCwibmFtZSI6IkxvZ2FuIEhhc3NvbiIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vLVBBZElibFBfWkowL0FBQUFBQUFBQUFJL0FBQUFBQUFBQUFBL0FBeVlCRjc0V2FfZUxJSGRMYzItODhBVDdmZ1Y4NlpDSWcvczk2LWMvcGhvdG8uanBnIiwiZ2l2ZW5fbmFtZSI6IkxvZ2FuIiwiZmFtaWx5X25hbWUiOiJIYXNzb24iLCJsb2NhbGUiOiJlbiJ9.AlKDr4beAw7nTTuebFHCS-Mi6VCBPCn3fERief9Itl4gtxY8j5rZgvyjSprplbFbwDCOF_YW4YJB4BcHmKCEbw0TXvGPjPla84U7GJZvKxKSAh2oyYW6aJGGKK_CY5AH5GLAmgzg_3TuuF026YAHzpEYTQSPRG28LCJxGhNiMKPEdQi7D7r85aCE0CbhGOvFClaoyrLRMeEgvbkskVcl1xRvhzdxee974k92T10kjScRPQRPdjs98i3EFXO4IYwh5c0k7eg-0LkJgddJARM5FN4UN8Cu1VsKZhjsoh2WNLpQ8CLHtiC7ov24WOb2dSZNOCqX1NB2A2cmMDrWvKRMiw`;

interface ISetup {
  patient: Patient;
  clinic: Clinic;
  user: User;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole, 'a@b.com'), txn);
  const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);

  return {
    clinic,
    patient,
    user,
  };
}

describe('processing SIU scheduling jobs', () => {
  let txn = null as any;

  beforeAll(async () => {
    queue.testMode.enter();
  });

  beforeEach(async () => {
    queue.testMode.clear();

    txn = await transaction.start(PatientSiuEvent.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    queue.testMode.exit();
    queue.shutdown(0, () => true); // There must be a better way to do this...
  });

  it('throws an error if data is missing', async () => {
    const data = {
      patientId: uuid(),
    };

    await expect(processNewSchedulingMessage(data as any, txn)).rejects.toMatch(
      'Missing either patientId, eventType, transmissionId, visitId, dateTime, or duration',
    );
  });

  describe('with a new siu event', () => {
    it('creates a new calendar event for a patient without a calendar', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({ patientId: patient.id, dateTime });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);
      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', {
          summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        })
        .reply(200, {
          id: googleCalendarId,
        });

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/acl`)
        .post('', { role: 'writer', scope: { type: 'user', value: user.email } })
        .reply(200, {});

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('creates a new calendar event for a patient with a calendar already', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({ patientId: patient.id, dateTime });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });
  });

  describe('with a cancel siu event', () => {
    it('creates a new cancelled calendar event for a patient without a calendar', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Cancel',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);
      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', {
          summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        })
        .reply(200, {
          id: googleCalendarId,
        });

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/acl`)
        .post('', { role: 'writer', scope: { type: 'user', value: user.email } })
        .reply(200, {});

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeFalsy();

      const deletedSiuEvent = await PatientSiuEvent.query(txn).findOne({
        visitId: message.visitId,
      });
      expect(deletedSiuEvent!.patientId).toBe(patient.id);
      expect(parseInt(deletedSiuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(deletedSiuEvent!.googleEventId).toBe(googleEventId);
      expect(deletedSiuEvent!.deletedAt).toBeTruthy();
    });

    it('creates a new cancelled calendar event for a patient with a calendar already', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Cancel',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeFalsy();

      const deletedSiuEvent = await PatientSiuEvent.query(txn).findOne({
        visitId: message.visitId,
      });
      expect(deletedSiuEvent!.patientId).toBe(patient.id);
      expect(parseInt(deletedSiuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(deletedSiuEvent!.googleEventId).toBe(googleEventId);
      expect(deletedSiuEvent!.deletedAt).toBeTruthy();
    });

    it("doesn't cancel a calendar event for a patient if transmission id is lower", async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Cancel',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId + 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId + 1);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('cancels a calendar event for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Cancel',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId - 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(
        `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events/${googleEventId}`,
      )
        .delete('')
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeFalsy();

      const deletedSiuEvent = await PatientSiuEvent.query(txn).findOne({
        visitId: message.visitId,
      });
      expect(deletedSiuEvent!.patientId).toBe(patient.id);
      expect(parseInt(deletedSiuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(deletedSiuEvent!.googleEventId).toBe(googleEventId);
      expect(deletedSiuEvent!.deletedAt).toBeTruthy();
    });
  });

  describe('with a modification siu event', () => {
    it('creates a new calendar event for a patient without a calendar', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Modification',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);
      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', {
          summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        })
        .reply(200, {
          id: googleCalendarId,
        });

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/acl`)
        .post('', { role: 'writer', scope: { type: 'user', value: user.email } })
        .reply(200, {});

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('creates a new calendar event for a patient with a calendar already', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Modification',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it("doesn't modify a calendar event for a patient if transmission id is lower", async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Modification',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId + 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId + 1);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('modifies a calendar event for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Modification',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId - 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(
        `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events/${googleEventId}`,
      )
        .put('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });
  });

  describe('with a reschedule siu event', () => {
    it('creates a new calendar event for a patient without a calendar', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Reschedule',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);
      nock('https://www.googleapis.com/calendar/v3/calendars')
        .post('', {
          summary: `${patient.firstName} ${patient.lastName} - [${patient.cityblockId}]`,
        })
        .reply(200, {
          id: googleCalendarId,
        });

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/acl`)
        .post('', { role: 'writer', scope: { type: 'user', value: user.email } })
        .reply(200, {});

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('creates a new calendar event for a patient with a calendar already', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Reschedule',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent).toBeTruthy();
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it("doesn't reschedule a calendar event for a patient if transmission id is lower", async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Reschedule',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId + 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(`https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events`)
        .post('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId + 1);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });

    it('reschedule a calendar event for a patient', async () => {
      const { patient, user } = await setup(txn);
      const googleCalendarId = 'fakeCalendarId';
      await PatientInfo.edit(
        { updatedById: user.id, googleCalendarId },
        patient.patientInfo.id,
        txn,
      );

      const googleEventId = 'fakeGoogleEventId';
      const dateTime = new Date().toISOString();
      const message = createMockSiuMessage({
        patientId: patient.id,
        dateTime,
        eventType: 'Reschedule',
      });
      const calendarFields = getGoogleCalendarFieldsFromSIU(message as any);
      const testConfig = mockGoogleCredentials();

      await PatientSiuEvent.create(
        {
          visitId: message.visitId,
          patientId: patient.id,
          transmissionId: message.transmissionId - 1,
          googleEventId,
        },
        txn,
      );

      mockGoogleOauthAuthorize(cityblockToken);

      nock(
        `https://www.googleapis.com/calendar/v3/calendars/${googleCalendarId}/events/${googleEventId}`,
      )
        .put('', calendarFields)
        .reply(200, {
          id: googleEventId,
          ...calendarFields,
        });

      await processNewSchedulingMessage(message as any, txn, testConfig);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });
  });
});
