import * as nock from 'nock';
import {
  IAddNoteToAppointmentResponse,
  IBookAppointmentResponse,
  ICheckinAppointmentResponse,
  ICheckoutAppointmentResponse,
  IOpenAppointmentResponse,
  IPatientInfoAthena,
} from './apis/athena/types';
import {
  IRedoxClinicalSummaryEncounter,
  IRedoxClinicalSummaryMedication,
  IRedoxPatientCreateResponse } from './apis/redox/types';
import config from './config';
import CareTeam from './models/care-team';
import Patient, { IPatientEditableFields } from './models/patient';

export interface ICreatePatient extends IPatientEditableFields {
  athenaPatientId: number;
}

export async function createPatient(patient: ICreatePatient, userId: string): Promise<Patient> {
  const instance = await Patient.query().insertAndFetch(patient);
  await CareTeam.addUserToCareTeam({ userId, patientId: instance.id });
  return instance;
}

export function createMockPatient(athenaPatientId = 1, homeClinicId = '1') {
  return {
    athenaPatientId,
    firstName: 'dan',
    lastName: 'plant',
    homeClinicId,
    zip: 11238,
    gender: 'M',
    dateOfBirth: '01/01/1900',
    consentToCall: false,
    consentToText: false,
    language: 'en',
  };
}

export function createMockAthenaPatient(
  athenaId: number,
  firstName: string = 'Constance',
  lastName: string = 'Blanton',
): IPatientInfoAthena {
  return {
    preferredname: 'IV',
    racename: 'Patient Declined',
    email: 'email@internet.com',
    suffix: 'IV',
    departmentid: '1',
    homephone: '6175941000',
    guarantorstate: 'MA',
    portalaccessgiven: true,
    driverslicense: true,
    referralsourceid: '2',
    contactpreference_appointment_email: false,
    homebound: false,
    contactpreference_appointment_sms: true,
    contactpreference_billing_phone: false,
    ethnicitycode: 'declined',
    contactpreference_announcement_phone: false,
    contactpreference: 'MOBILEPHONE',
    lastemail: 'lukasz.jachym@gmail.com',
    middlename: 'middlename',
    contactrelationship: 'Spouse',
    employerid: '1',
    contacthomephone: '8885551241',
    guarantorssn: '*****4150',
    contactpreference_lab_sms: true,
    guarantordob: '01/01/1990',
    zip: '75287',
    guarantoraddresssameaspatient: false,
    employerphone: '8885559371',
    portaltermsonfile: true,
    status: 'active',
    lastname: lastName,
    guarantorfirstname: 'Alan',
    city: 'DALLAS',
    ssn: '*****4150',
    lastappointment: '03/31/2017 09:00',
    employercity: 'test',
    povertylevelincomedeclined: false,
    guarantoremail: 'lukasz.jachym@gmail.com',
    guarantorcity: 'SOUTHBRIDGE',
    guarantorzip: '01550',
    sex: 'F',
    privacyinformationverified: true,
    primarydepartmentid: '148',
    contactpreference_lab_email: true,
    balances: [{
      balance: '-492.7',
      departmentlist: '1,21,102,145,148,150,157,162',
      providergroupid: 1,
      cleanbalance: true,
    }, {
      balance: 0,
      departmentlist: '62,142,164',
      providergroupid: 2,
      cleanbalance: true,
    }, {
      balance: 0,
      departmentlist: '82',
      providergroupid: 22,
      cleanbalance: true,
    }],
    contactpreference_announcement_sms: true,
    emailexists: true,
    race: ['declined'],
    employerstate: 'MA',
    firstappointment: '08/20/2010 10:30',
    language6392code: 'eng',
    primaryproviderid: '103',
    patientphoto: true,
    consenttocall: true,
    defaultpharmacyncpdpid: '0125547',
    povertylevelincomerangedeclined: false,
    contactpreference_billing_email: false,
    employerzip: '01089',
    patientphotourl: '/preview1/195900/patients/1/photo',
    mobilephone: '8005551234',
    contactpreference_announcement_email: false,
    hasmobile: true,
    registrationdate: '10/08/2008',
    guarantorsuffix: 'IV',
    caresummarydeliverypreference: 'PORTAL',
    guarantorlastname: 'Knarr',
    firstname: firstName,
    guarantorcountrycode: 'USA',
    state: 'TN',
    contactpreference_appointment_phone: false,
    patientid: '1',
    dob: '01/01/1990',
    guarantorrelationshiptopatient: '1',
    address1: 'Times Sq.',
    guarantoremployerid: '1',
    contactpreference_billing_sms: true,
    guarantorphone: '1111111111',
    povertylevelfamilysizedeclined: false,
    employername: 'TEST',
    driverslicenseurl: '/preview1/195900/patients/1/driverslicense',
    employeraddress: 'test',
    maritalstatus: 'M',
    countrycode: 'USA',
    guarantoraddress1: '8762 Stoneridge Ct',
    maritalstatusname: 'MARRIED',
    consenttotext: true,
    countrycode3166: 'US',
    onlinestatementonly: true,
    contactpreference_lab_phone: false,
    guarantorcountrycode3166: 'US',
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
      expires: new Date('01-01-2020').toUTCString(),
      accessToken: 'cool-token',
      refreshToken: 'refreshing-token',
    });
}

export function mockRedoxCreatePatient(athenaPatientId: number) {
  const response: IRedoxPatientCreateResponse = {
    Patient: {
      Identifiers: [{
        IDType: 'AthenaNet Enterprise ID',
        ID: String(athenaPatientId),
      }],
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
      Destinations: [{
        ID: 'athena-sandbox-id',
        Name: 'athenahealth sandbox',
      }],
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

// Athena
export function restoreAthenaFetch() {
  nock.cleanAll();
}

export function mockAthenaTokenFetch() {
  nock(config.ATHENA_TOKEN_URL)
    .post('')
    .reply(200, {
      expires_in: 3600,
      access_token: 'stub',
    });
}

export function mockAthenaGet(path: string, body: any, times = 1) {
  nock(config.ATHENA_API_BASE)
    .get(path)
    .times(times)
    .query(true)
    .reply(200, body);
}

export function mockAthenaPost(path: string, body: any) {
  nock(config.ATHENA_API_BASE)
    .post(path)
    .reply(200, body);
}

export function mockAthenaPostError(path: string, body: any, status: number) {
  nock(config.ATHENA_API_BASE)
    .post(path)
    .reply(status, body);
}

export function mockAthenaPut(path: string, body: any) {
  nock(config.ATHENA_API_BASE)
    .put(path)
    .reply(200, body);
}

export function mockAthenaPutError(path: string, body: any, status: number) {
  nock(config.ATHENA_API_BASE)
    .put(path)
    .reply(status, body);
}

export type MockAthenaPatient = Pick<IPatientInfoAthena, 'patientid'> & Partial<IPatientInfoAthena>;
export type MockAthenaOpenAppointment = Partial<IOpenAppointmentResponse>;
export type MockAthenaBookAppointment = Partial<IBookAppointmentResponse>;
export type MockAthenaCheckinAppointment = Partial<ICheckinAppointmentResponse>;
export type MockAthenaCheckoutAppointment = Partial<ICheckoutAppointmentResponse>;
export type MockAthenaAddNoteToAppointment = Partial<IAddNoteToAppointmentResponse>;

export function mockAthenaGetPatient(
  athenaPatientId: number, body: MockAthenaPatient, times = 1,
) {
  mockAthenaGet(
    `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    body,
    times,
  );
}

export function mockAthenaEditPatient(
  athenaPatientId: number, times = 1,
) {
  mockAthenaPut(
    `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    [{ athenaPatientId }],
  );
}

export function mockAthenaCreatePatient(athenaPatientId: number) {
  mockAthenaPost(`/${config.ATHENA_PRACTICE_ID}/patients`, [{ patientid: athenaPatientId }]);
}

export function mockAthenaOpenAppointment(body: MockAthenaOpenAppointment) {
  mockAthenaPost(`/${config.ATHENA_PRACTICE_ID}/appointments/open`, body);
}

export function mockAthenaOpenAppointmentError() {
  mockAthenaPostError(
    `/${config.ATHENA_PRACTICE_ID}/appointments/open`,
    { detailedmessage: 'Appointment type ID is invalid.', error: 'The data provided is invalid.' },
    400);
}

export function mockAthenaBookAppointment(appointmentId: string, body: MockAthenaBookAppointment) {
  mockAthenaPut(`/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}`, body);
}

export function mockAthenaBookAppointmentError(appointmentId: string) {
  mockAthenaPutError(
    `/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}`,
    {
      detailedmessage: 'The appointment ID is already booked or is not marked as available.',
      error: 'That appointment time was already booked or is not available for booking.',
    }, 409);
}

export function mockAthenaCheckinAppointment(
  appointmentId: string,
  body: MockAthenaCheckinAppointment,
) {
  mockAthenaPost(`/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/checkin`, body);
}

export function mockAthenaCheckinAppointmentError(appointmentId: string) {
  mockAthenaPostError(
    `/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/checkin`,
    {
      detailedmessage: 'The appointment is either already canceled or checked in',
      error: 'This appointment has already been checked in',
    }, 404);
}

export function mockAthenaCheckoutAppointment(
  appointmentId: string,
  body: MockAthenaCheckoutAppointment,
) {
  mockAthenaPost(`/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/checkout`, body);
}

export function mockAthenaCheckoutAppointmentError(appointmentId: string) {
  mockAthenaPostError(
    `/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/checkout`,
    { error: 'The appointment has already been checked-out' }, 400);
}

export function mockAthenaAddNoteToAppointment(
  appointmentId: string,
  body: MockAthenaAddNoteToAppointment,
) {
  mockAthenaPost(`/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/notes`, body);
}

export function mockAthenaAddNoteToAppointmentError(appointmentId: string) {
  mockAthenaPostError(
    `/${config.ATHENA_PRACTICE_ID}/appointments/${appointmentId}/notes`,
    { error: 'The appointment is not available.' }, 404);
}
