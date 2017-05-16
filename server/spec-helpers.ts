import * as nock from 'nock';
import { IPatientInfoAthena } from './apis/athena/types';
import config from './config';

export function createMockAthenaPatient(
  athenaId: number,
  firstName: string,
  lastName: string = 'foo',
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
    lastname: 'Blanton',
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
    firstname: 'Constance',
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

export function mockAthenaPut(path: string, body: any) {
  nock(config.ATHENA_API_BASE)
    .put(path)
    .reply(200, body);
}

type MockAthenaPatient = Pick<IPatientInfoAthena, 'patientid'> & Partial<IPatientInfoAthena>;

export function mockAthenaGetPatient(
  athenaPatientId: number, body: MockAthenaPatient, times = 1,
) {
  mockAthenaGet(
    `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    body,
    times,
  );
}
