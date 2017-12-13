import * as nock from 'nock';
import {
  IRedoxClinicalSummaryEncounter,
  IRedoxClinicalSummaryMedication,
  IRedoxPatientCreateResponse,
} from './apis/redox/types';
import config from './config';
import CarePlanUpdateEvent from './models/care-plan-update-event';
import CareTeam from './models/care-team';
import Patient, { IPatientEditableFields } from './models/patient';
import PatientAnswerEvent from './models/patient-answer-event';
import { UserRole } from './models/user';

export interface ICreatePatient extends IPatientEditableFields {
  athenaPatientId: number;
}

export async function createPatient(patient: ICreatePatient, userId: string): Promise<Patient> {
  const instance = await Patient.query().insertAndFetch(patient);
  await CareTeam.create({ userId, patientId: instance.id });
  return instance;
}

export function createMockPatient(
  athenaPatientId = 1,
  homeClinicId: string,
  firstName?: string,
  lastName?: string,
) {
  return {
    athenaPatientId,
    firstName: firstName || 'dan',
    lastName: lastName || 'plant',
    homeClinicId,
    zip: '11238',
    gender: 'M',
    dateOfBirth: '01/01/1900',
    consentToCall: false,
    consentToText: false,
    language: 'en',
  };
}

export function createMockUser(
  athenaProviderId = 1,
  homeClinicId: string,
  userRole: UserRole = 'admin',
  email: string = 'dan@plant.com',
) {
  return {
    firstName: 'dan',
    lastName: 'plant',
    userRole,
    email,
    homeClinicId,
    athenaProviderId,
  };
}

export function createMockClinic(name = 'The Dan Plant Center', departmentId = 11) {
  return {
    name,
    departmentId,
  };
}

export function createMockRiskAreaGroup(
  title = 'Night King Breach of the Wall',
  mediumRiskThreshold = 50,
  highRiskThreshold = 80,
) {
  return {
    title,
    mediumRiskThreshold,
    highRiskThreshold,
  };
}

// Google Auth
export function mockGoogleOauthAuthorize(idToken: string) {
  nock('https://www.googleapis.com/oauth2/v4/token')
    .post('')
    .reply(200, {
      id_token: idToken,
      expires_in: 3600,
      access_token: 'stub',
      token_type: 'Bearer',
    });
}

// Redox
export function mockRedoxPost(body: any) {
  nock(config.REDOX_API_URL)
    .post('')
    .reply(200, body);
}

export function mockRedoxPostError(body: any, status = 400) {
  nock(config.REDOX_API_URL)
    .post('')
    .reply(status, body);
}

export function mockRedoxTokenFetch() {
  nock(config.REDOX_TOKEN_URL)
    .post('')
    .reply(200, {
      expires: new Date('01-01-2020').toISOString(),
      accessToken: 'cool-token',
      refreshToken: 'refreshing-token',
    });
}

export function mockRedoxCreatePatient(athenaPatientId: number) {
  const response: IRedoxPatientCreateResponse = {
    Patient: {
      Identifiers: [
        {
          IDType: 'AthenaNet Enterprise ID',
          ID: String(athenaPatientId),
        },
      ],
    },
    Meta: {
      DataModel: 'PatientAdmin',
      EventType: 'NewPatient',
      Message: {
        ID: 123,
      },
      Source: {
        ID: 'source',
      },
      Destinations: [
        {
          ID: 'athena-sandbox-id',
          Name: 'athenahealth sandbox',
        },
      ],
    },
  };
  mockRedoxPost(response);
}

export function mockRedoxCreatePatientError() {
  mockRedoxPostError({
    Meta: {
      DataModel: 'PatientAdmin',
      EventType: 'NewPatient',
      Message: {
        ID: 101141540,
      },
      Source: {
        ID: '87c226a2-9e53-481e-a9e9-68b5fbdb6471',
        Name: 'Athena Sandbox (s)',
      },
      Destinations: [
        {
          ID: 'aed98aae-5e94-404f-912d-9ca0b6ebe869',
          Name: 'athenahealth sandbox',
        },
      ],
      Errors: [
        {
          ID: 1505416,
          Text: 'Post received a 400 response',
          Type: 'transmission',
          Module: 'Send',
        },
      ],
    },
  });
}

export type MockRedoxClinicalSummaryEncounter = Partial<IRedoxClinicalSummaryEncounter>;
export type MockRedoxClinicalSummaryMedication = Partial<IRedoxClinicalSummaryMedication>;

export function mockRedoxGetPatientEncounters(encountersBody: MockRedoxClinicalSummaryEncounter[]) {
  const fullResponseBody = {
    Meta: {
      DataModel: 'Clinical Summary',
      EventType: 'PatientQuery',
    },
    Encounters: encountersBody,
  };

  mockRedoxPost(fullResponseBody);
}

export function mockRedoxGetPatientMedications(
  medicationsBody: MockRedoxClinicalSummaryMedication[],
) {
  const fullResponseBody = {
    Meta: {
      DatModel: 'Clinical Summary',
      EventType: 'PatientQuery',
    },
    Medications: medicationsBody,
  };

  mockRedoxPost(fullResponseBody);
}

export async function cleanPatientAnswerEvents(patientId: string) {
  const patientAnswerEvents = await PatientAnswerEvent.getAllForPatient(patientId, {
    pageNumber: 0,
    pageSize: 10,
  });
  patientAnswerEvents.results.map(
    async patientAnswerEvent => await PatientAnswerEvent.delete(patientAnswerEvent.id),
  );
}

export async function cleanCarePlanUpdateEvents(patientId: string) {
  const carePlanUpdateEvents = await CarePlanUpdateEvent.getAllForPatient(patientId, {
    pageNumber: 0,
    pageSize: 10,
  });

  carePlanUpdateEvents.results.map(
    async carePlanUpdateEvent => await CarePlanUpdateEvent.delete(carePlanUpdateEvent.id),
  );
}
