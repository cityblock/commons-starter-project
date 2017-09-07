import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import RedoxApi from '../../apis/redox';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
  mockRedoxCreatePatient,
  mockRedoxCreatePatientError,
  mockRedoxTokenFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient', () => {
  let redoxApi: RedoxApi;
  let db: Db;
  let patient: Patient;
  let user: User;
  let homeClinicId: string;
  const userRole = 'physician';

  beforeEach(async () => {
    jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    redoxApi = await RedoxApi.get();
    db = await Db.get();
    await Db.clear();
    mockRedoxTokenFetch();

    const homeClinic = await HomeClinic.create({
      name: 'cool clinic',
      departmentId: 1,
    });
    homeClinicId = homeClinic.id;
    user = await User.create({
      email: 'a@b.com',
      userRole,
      homeClinicId,
    });
    patient = await createPatient(createMockPatient(1, homeClinicId), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('resolvePatient', () => {
    it('returns patient', async () => {
      const query = `{
        patient(patientId: "${patient.id}") {
          id, firstName, lastName
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patient)).toMatchObject({
        id: patient.id,
        firstName: 'dan',
        lastName: 'plant',
      });
    });
  });

  describe('patientEdit', () => {
    it('edits patient', async () => {
      const query = `mutation {
        patientEdit(input: { patientId: "${patient.id}", firstName: "first" }) {
          id, firstName
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patientEdit)).toMatchObject({
        id: patient.id,
        firstName: 'first',
      });
    });
  });

  describe('patientSetup', () => {
    it('sets up patient', async () => {
      const query = `mutation {
        patientSetup(input: {
          firstName: "first",
          lastName: "last",
          gender: "F",
          zip: 12345,
          homeClinicId: "${homeClinicId}",
          dateOfBirth: "02/02/1902",
          consentToText: true,
          consentToCall: true,
          maritalStatus: "Unknown",
          race: "Other Race",
          ssn: "123456789",
          language: "en",
        }) {
          id, firstName, lastName, gender, zip, dateOfBirth
        }
      }`;

      mockRedoxCreatePatient(123);

      const result = await graphql(schema, query, null, {
        redoxApi,
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientSetup)).toMatchObject({
        firstName: 'first',
        lastName: 'last',
        gender: 'F',
        zip: 12345,
        dateOfBirth: '02/02/1902',
      });
    });

    it('errors and does not create patient when Athena fails', async () => {
      const patientCount = await Patient.query().count();

      const query = `mutation {
        patientSetup(input: {
          firstName: "first",
          lastName: "last",
          gender: "F",
          zip: 12345,
          homeClinicId: "${homeClinicId}",
          dateOfBirth: "02/02/1902",
          consentToText: true,
          consentToCall: true,
          maritalStatus: "Unknown",
          race: "Other Race",
          ssn: "123456789",
          language: "en",
        }) {
          id, firstName, lastName, gender, zip, dateOfBirth
        }
      }`;

      mockRedoxCreatePatientError();

      const result = await graphql(schema, query, null, {
        redoxApi,
        db,
        userRole,
        userId: user.id,
      });
      expect(result.errors![0].message).toContain(
        'Post received a 400 response, https://api.redoxengine.com/endpoint, 400',
      );
      expect(await Patient.query().count()).toEqual(patientCount);
    });
  });

  describe('resolvePatientScratchPad', () => {
    it('resolves a patient scratchPad', async () => {
      await Patient.edit({ scratchPad: 'Test Scratch Pad' }, patient.id);

      const query = `{
        patientScratchPad(patientId: "${patient.id}") {
          text
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole, userId: user.id });

      expect(cloneDeep(result.data!.patientScratchPad)).toMatchObject({
        text: 'Test Scratch Pad',
      });
    });
  });

  describe('patientScratchPadEdit', () => {
    it('saves a patient scratchPad', async () => {
      await Patient.edit({ scratchPad: 'Unedited Scratch Pad' }, patient.id);

      const query = `mutation {
        patientScratchPadEdit(input: { patientId: "${patient.id}", text: "Edited Scratch Pad" }) {
          text
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });
      expect(cloneDeep(result.data!.patientScratchPadEdit)).toMatchObject({
        text: 'Edited Scratch Pad',
      });
    });
  });
});
