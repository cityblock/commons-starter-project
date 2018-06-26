/**
 * @jest-environment node
 */
import kue from 'kue';
import nock from 'nock';
import { transaction, Transaction } from 'objection';
import { UserRole } from 'schema';
import uuid from 'uuid/v4';
import config from '../../config';
import { getGoogleCalendarFieldsFromSIU } from '../../helpers/google-calendar-helpers';
import queueHelpers from '../../helpers/queue-helpers';
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
import {
  processNewCalendarEventMessage,
  processNewSchedulingMessage,
} from '../scheduling-consumer';

const queue = kue.createQueue();

const userRole = 'Pharmacist' as UserRole;
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
  const originalAddJob = queueHelpers.addJobToQueue;

  beforeAll(async () => {
    queue.testMode.enter();
    config.GCP_CREDS = '{"private_key":"-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCyxrqMnMzxS81l\\n0fbRMDgg2je3wDLBOg96cSnIcb4cq2mmKQwYUQyzSikcVhBF4OwJOuybntOtxlyG\\nDz9f66rW8G4hKdcz0m7Og6fcMP25BT4plVOMNPZPjFu66RJE1ZNqiv6uzZXEgOAn\\na2xlXg+o0ejaqvpxe/meNad4cLjsjM2/pOqy9Pk2sBp3yFggyO1tECVFnitik+Oq\\nRm45796fCmUh8GcvPiJUg+x/u0Url0VZzVBwhiQtdEUYx/tUSWxVggNJGPUcUER2\\nFm+xcfeN5GhaxS5+ZTTZyEWhZJQxeASE17jBl8c7XkDqMQlwotK0GS/hhLluFJvP\\nBAF5B4+dAgMBAAECggEAEcRAK9M1ZtGCsxi/r6BcI5+sI9287YkImsF+RoZPP2gl\\nkrbHle8QFQ1Msp029srYij5J31lUbhOlhEklojG4g63XNAKFeYfzLSDWYMKZpHaJ\\n6/YEHI3y4IrxXszk3ORgxxjTIKobtTCdli1N03Eam0tpGboeM4L/lqJ8ZzLEnfVh\\nXr9A47wgJpB4CZh1ipjmqDQJQ8Ej3JygaXErT04J0mmGs9ZO2M/ijl2PubqibcQs\\njt2MKGMcwVTXxjqES5tjUYKzYpl9IW2528SRUiYH5egQiEr7EUd4m2dWouiQ4UEj\\nJGCbrrOySzMLFcLD7XwuLyze6kkz121MM4vSG8rS4QKBgQD1HvHBuYN4eUd08gkb\\npDZs4zFBjI8okNkZfsvr/o8GFHdm+5in60dXda13ZtrzYT+Bl+ck/jarEZlWgqV6\\nEcti6i58xVP7FLc3bAZg0BMrYAEDYlVeuFZex99nbaawUlY6JyPQppgCX6AY1EhD\\nnfgS1yXl5Ziiom1ASQEiulU7hQKBgQC6tfqsBWRM8l5xUlCz0UJi7+G9kKLbIUQL\\nnJQRP3PTX9/KzUZi5EOzKLp3zEEz3N8fLn9YI9hUu7qAGC/ZLrHORIfOeOL6Tt2C\\nvcrWNlYHzxVp6LG2r6vyYA1XpeDheyMIXuRKPYjAJU91ru70vpPOyQ8xVUKYt2fa\\nhv40zQvDOQKBgE6yhanN1tDqFzALuTLfsP2an6jM6PV8M8eEtxHoo6CvF3q/0k4v\\nMrN4u523LxquoUYJMBPnbkPUHafxwBEF/4edahly/TiCeSRZEV8pzs3BP/IHMyN7\\nCXfasfYx9S9s7/QxtsT5h5pTe0Idfan/4LKj0q4R3cRxY6QdDDlLG6xFAoGAPueQ\\nzOQEJuiBaSyShAK8mxi2tWdFdw5+Hmtid20pWM20WF9Ql4DQTkwqhrIKRa7kfVzt\\nCoUJHYMiEoYTmNhij1wHZUjVL//iIWpQLFuiIH9kd4ouVZ5aEA7Mb/szCMSzyN4v\\ni9Ovfw0S+FM3rr2GjuSuebB//3PLSZSxkJiEngECgYEA416H0a457vjnN6mzTktD\\nXI3Na36Q/VdXmMR5f9GXagpsBIO101XM7U3YY36jD7GzQaOQpZvwiZKy0jVLfx8B\\nXb1Ugj9ljqyWt9K0Fni+LrsvkV2pPURokdT3j+DfcnOklUMAPQzzZZ2FfkFX80do\\ngnIFsJBQxOKRwboOpg2YZtl=\\n-----END PRIVATE KEY-----\\n","client_email":"laura-robot@fake-credentials.iam.gserviceaccount.com"}' as any;
  });

  beforeEach(async () => {
    queue.testMode.clear();
    queueHelpers.addJobToQueue = jest.fn();
    txn = await transaction.start(PatientSiuEvent.knex());
  });

  afterEach(async () => {
    await txn.rollback();
    queueHelpers.addJobToQueue = originalAddJob;
  });

  afterAll(async () => {
    queue.testMode.exit();
    config.GCP_CREDS = null as any;
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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);
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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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

      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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

      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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

      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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

      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

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
      const calendarEventData = (queueHelpers.addJobToQueue as any).mock.calls[0][1];

      expect(queueHelpers.addJobToQueue).toBeCalledWith(
        'calendarEvent',
        expect.objectContaining({ googleCalendarId: 'fakeCalendarId' }),
      );
      mockGoogleOauthAuthorize('token');
      await processNewCalendarEventMessage(calendarEventData, txn);

      const siuEvent = await PatientSiuEvent.getByVisitId(message.visitId, txn);
      expect(siuEvent!.patientId).toBe(patient.id);
      expect(parseInt(siuEvent!.transmissionId as any, 10)).toBe(message.transmissionId);
      expect(siuEvent!.googleEventId).toBe(googleEventId);
      expect(siuEvent!.deletedAt).toBeFalsy();
    });
  });
});
