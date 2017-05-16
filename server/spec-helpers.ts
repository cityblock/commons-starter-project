import * as nock from 'nock';
import {
  IPatientInfoAthena,
 } from './apis/athena/types';
import config from './config';

export function createMockAthenaPatient(
  athenaId: number,
  firstName: string,
  lastName: string = 'foo',
) {
  return {
    resourceType: 'Patient',
    id: `Patient-${config.ATHENA_PRACTICE_ID}.1.${athenaId}`,
    name: [{
      given: [firstName],
      use: 'official',
      family: [lastName],
    }],
    birthDate: '1990-01-01',
    identifier: [{
      system: `urn:oid:2.16.840.1.113883.3.564.${config.ATHENA_PRACTICE_ID}`,
      use: 'official',
      value: '1',
    }],
    address: [{
      country: 'UNITED STATES',
      city: 'New York',
      state: 'New York',
      use: 'home',
      postalCode: '10001',
      line: ['1 Road Place Drive'],
    }],
    communication: [{
      language: {
        text: 'English',
        coding: [{
          system: 'http://tools.ietf.org/html/bcp47',
          display: 'English',
          code: 'en',
        }],
      },
    }],
    telecom: [{
      use: 'home',
      system: 'phone',
      value: '617-594-1000',
    }, {
      use: 'mobile',
      system: 'phone',
      value: '800-555-1234',
    }, {
      system: 'email',
      value: 'email@example.com',
    }],
    gender: 'female',
    extension: [{
      valueCodeableConcept: {
        coding: [{
          system: 'http://hl7.org/fhir/v3/Race',
          display: 'Patient Declined',
        }],
      },
      url: 'http://hl7.org/fhir/StructureDefinition/us-core-race',
    }, {
      valueCodeableConcept: {
        coding: [{
          system: 'http://hl7.org/fhir/v3/Ethnicity',
          display: 'Patient Declined',
        }],
      },
      url: 'http://hl7.org/fhir/StructureDefinition/us-core-ethnicity',
    }, {
      valueCodeableConcept: {
        text: 'Female',
        coding: [{
          system: 'http://hl7.org/fhir/v3/AdministrativeGender',
          display: 'Female',
          code: 'F',
        }],
      },
      url: 'http://hl7.org/fhir/StructureDefinition/us-core-birth-sex',
    }],
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

type MockAthenaPatient = Pick<IPatientInfoAthena, 'id'> & Partial<IPatientInfoAthena>;

export function mockAthenaGetPatient(athenaPatientId: number, body: MockAthenaPatient, times = 1) {
  mockAthenaGet(
    `/${config.ATHENA_PRACTICE_ID}/patients/${athenaPatientId}`,
    body,
    times,
  );
}
