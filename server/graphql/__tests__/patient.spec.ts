import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import AthenaApi from '../../apis/athena';
import Db from '../../db';
import HomeClinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockAthenaPatient,
  createMockPatient,
  createPatient,
  mockAthenaCreatePatient,
  mockAthenaCreatePatientError,
  mockAthenaEditPatient,
  mockAthenaGetPatient,
  mockAthenaTokenFetch,
  restoreAthenaFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient', () => {

  let athenaApi: AthenaApi = null as any;
  let db: Db = null as any;
  let patient = null as any;
  let user = null as any;
  let homeClinicId = null as any;
  const userRole = 'physician';

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    db = await Db.get();
    await Db.clear();
    mockAthenaTokenFetch();

    const homeClinic = await HomeClinic.create({ name: 'cool clinic', departmentId: 1 });
    homeClinicId = homeClinic.id;
    user = await User.create({
      email: 'a@b.com',
      userRole,
      homeClinicId,
    });
    patient = await createPatient(createMockPatient(1, homeClinicId), user.id);
  });

  afterEach(async () => {
    restoreAthenaFetch();
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
        }) {
          id, firstName, lastName, gender, zip, dateOfBirth
        }
      }`;

      mockAthenaCreatePatient(2);

      const result = await graphql(
        schema, query, null, { athenaApi, db, userRole, userId: user.id },
      );
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
        }) {
          id, firstName, lastName, gender, zip, dateOfBirth
        }
      }`;

      mockAthenaCreatePatientError();

      const result = await graphql(
        schema, query, null, { athenaApi, db, userRole, userId: user.id },
      );

      expect(result.errors![0].message).toContain('error!');
      expect(await Patient.query().count()).toEqual(patientCount);
    });
  });

  describe('resolvePatientHealthRecord', () => {
    it('returns patientHealthRecord', async () => {
      const query = `{
        patientHealthRecord(patientId: "${patient.id}") {
          id, firstName, lastName
        }
      }`;

      mockAthenaGetPatient(1, createMockAthenaPatient(1, 'Constance', 'Blanton'));

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
      expect(cloneDeep(result.data!.patientHealthRecord)).toMatchObject({
        id: patient.id,
        firstName: 'Constance',
        lastName: 'Blanton',
      });
    });
  });

  describe('editPatientHealthRecord', () => {

    it('edits patientHealthRecord', async () => {
      const query = `mutation {
        patientHealthRecordEdit(input: {
          firstName: "first",
          lastName: "last",
          gender: "F",
          preferredName: "cool name",
          patientId: "${patient.id}",
        }) {
          id, firstName, lastName, gender, preferredName,
        }
      }`;

      const mockPatient = createMockAthenaPatient(1, 'first', 'last');
      mockPatient.preferredname = 'cool name';
      mockAthenaEditPatient(1);
      mockAthenaGetPatient(1, mockPatient);

      const result = await graphql(
        schema, query, null, { athenaApi, db, userRole, userId: user.id },
      );
      expect(cloneDeep(result.data!.patientHealthRecordEdit)).toMatchObject({
        id: patient.id,
        firstName: 'first',
        lastName: 'last',
        gender: 'F',
        preferredName: 'cool name',
      });
    });
  });
});
