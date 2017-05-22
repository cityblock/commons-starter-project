import * as nock from 'nock';
import {
  IPatientEncountersResponse,
  IPatientInfoAthena,
  IPatientMedicationsResponse,
} from './apis/athena/types';
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

export function createMockAthenaPatientMedications(): IPatientMedicationsResponse {
  return {
    lastupdated: '01/09/2016',
    nomedicationsreported: false,
    sectionnote: 'hi',
    medications: [
      [{
        source: 'jdoe',
        createdby: 'jdoe',
        encounterid: 1,
        approvedby: 'bob',
        isstructuredsig: true,
        route: 'FAX',
        pharmacyncpdpid: '7',
        orderingmode: 'internet',
        quantityunit: 'tablet(s)',
        medicationid: 244875,
        issafetorenew: true,
        refillsallowed: 0,
        quantity: 1,
        medicationentryid: 'H462',
        structuredsig: {
          dosagefrequencyvalue: 1,
          dosageroute: 'oral',
          dosageaction: 'Take',
          dosageadditionalinstructions: 'before meals',
          dosagefrequencyunit: 'per day',
          dosagequantityunit: 'tablet(s)',
          dosagequantityvalue: 1,
          dosagefrequencydescription: 'every day',
          dosagedurationunit: 'day',
          dosagedurationvalue: 1,
        },
        events: [{
          eventdate: '04/20/2011',
          type: 'START',
        }, {
          eventdate: '06/11/2013',
          type: 'HIDE',
        }, {
          eventdate: '05/10/2011',
          type: 'ENTER',
        }, {
          eventdate: '04/20/2011',
          type: 'ORDER',
        }, {
          eventdate: '04/20/2011',
          type: 'ORDER',
        }, {
          eventdate: '04/20/2011',
          type: 'FILL',
        }],
        medication: 'Coumadin 2 mg tablet',
        unstructuredsig: 'Take 1 tablet every day by oral route before meals.',
        stopreason: 'complication',
        providernote: 'hello',
        patientnote: 'hello',
      }], [{
        source: 'ikinkel0',
        quantity: 1,
        quantityunit: 'tablet(s)',
        orderingmode: 'PRESCRIBE',
        encounterid: 1,
        approvedby: 'bob',
        pharmacyncpdpid: '7',
        createdby: 'jdoe',
        isstructuredsig: true,
        medicationid: 281259,
        refillsallowed: 0,
        route: 'FAX',
        issafetorenew: true,
        stopreason: 'complication',
        medicationentryid: 'C114422',
        structuredsig: {
          dosagefrequencyvalue: 1,
          dosageroute: 'oral',
          dosageaction: 'Take',
          dosagefrequencyunit: 'per day',
          dosagequantityunit: 'tablet(s)',
          dosagequantityvalue: 1,
          dosagefrequencydescription: 'every day',
          dosagedurationunit: 'day',
          dosagedurationvalue: 1,
          dosageadditionalinstructions: 'take it',
        },
        events: [{
          eventdate: '01/09/2016',
          type: 'ENTER',
        }],
        medication: 'Crestor 10 mg tablet',
        unstructuredsig: 'Take 1 tablet every day by oral route.',
        providernote: 'hello',
        patientnote: 'hello',
      }], [{
        source: 'jdoe',
        createdby: 'jdoe',
        quantityunit: 'tablet(s)',
        isstructuredsig: true,
        encounterid: 1,
        quantity: 1,
        pharmacyncpdpid: '7',
        orderingmode: 'internet',
        refillsallowed: 0,
        stopreason: 'complication',
        approvedby: 'bob',
        route: 'FAX',
        medicationid: 281261,
        issafetorenew: true,
        medicationentryid: 'H5642',
        structuredsig: {
          dosagefrequencyvalue: 1,
          dosageroute: 'oral',
          dosageaction: 'Take',
          dosagefrequencyunit: 'per day',
          dosagequantityunit: 'tablet(s)',
          dosagequantityvalue: 1,
          dosagefrequencydescription: 'every day',
          dosagedurationunit: 'day',
          dosagedurationvalue: 1,
          dosageadditionalinstructions: 'take it',
        },
        events: [{
          eventdate: '01/09/2016',
          type: 'ENTER',
        }],
        medication: 'Crestor 40 mg tablet',
        unstructuredsig: 'Take 1 tablet every day by oral route.',
        providernote: 'hello',
        patientnote: 'hello',
      }, {
        source: 'ikinkel0',
        quantityunit: 'tablet(s)',
        orderingmode: 'PRESCRIBE',
        approvedby: 'bob',
        createdby: 'jdoe',
        pharmacyncpdpid: '7',
        stopreason: 'complication',
        quantity: 1,
        providernote: 'hello',
        patientnote: 'hello',
        isstructuredsig: true,
        medicationid: 281261,
        refillsallowed: 0,
        route: 'FAX',
        encounterid: 33433,
        issafetorenew: true,
        medicationentryid: 'C114424',
        structuredsig: {
          dosagefrequencyvalue: 1,
          dosageroute: 'oral',
          dosageaction: 'Take',
          dosagefrequencyunit: 'per day',
          dosagequantityunit: 'tablet(s)',
          dosagequantityvalue: 1,
          dosagefrequencydescription: 'every day',
          dosagedurationunit: 'day',
          dosagedurationvalue: 1,
          dosageadditionalinstructions: 'take it',
        },
        events: [{
          eventdate: '01/09/2016',
          type: 'ENTER',
        }],
        medication: 'Crestor 40 mg tablet',
        unstructuredsig: 'Take 1 tablet every day by oral route.',
      }],
    ],
  };
}

interface IMockEncountersOpts {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
}

export function createMockAthenaPatientEncounters(
  { hasPreviousPage, hasNextPage }: IMockEncountersOpts,
): IPatientEncountersResponse {
  return {
    previous: hasPreviousPage ? 'http://link.com' : undefined,
    next: hasNextPage ? 'http://link.com' : undefined,
    encounters: [{
      encountertype: 'VISIT',
      patientstatusid: 1,
      stage: 'INTAKE',
      status: 'OPEN',
      appointmentid: 499874,
      patientlocationid: 21,
      providerid: 71,
      encounterdate: '01/25/2015',
      encountervisitname: 'Any 15',
      patientlocation: 'Waiting Room',
      providerlastname: 'Bricker',
      encounterid: 26576,
      lastupdated: '02/21/2015',
      providerfirstname: 'Adam',
      providerphone: '(207) 555-5555',
      patientstatus: 'Ready For Staff',
      diagnoses: [{
        diagnosisid: 1,
        icdcodes: [],
        snomedcode: 12345,
        description: 'A diagnosis',
      }],
    }],
    totalcount: 1,
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
type MockAthenaPatientMedications = Partial<IPatientMedicationsResponse>;
type MockAthenaPatientEncounters = Partial<IPatientEncountersResponse>;

export function mockAthenaGetPatient(
  athenaPatientId: number, body: MockAthenaPatient, times = 1,
) {
  mockAthenaGet(
    `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    body,
    times,
  );
}

export function mockAthenaGetPatientMedications(body: MockAthenaPatientMedications) {
  mockAthenaGet(`/${config.ATHENA_PRACTICE_ID}/chart/1/medications`, body);
}

export function mockAthenaGetPatientEncounters(body: MockAthenaPatientEncounters) {
  mockAthenaGet(`/${config.ATHENA_PRACTICE_ID}/chart/1/encounters`, body);
}
