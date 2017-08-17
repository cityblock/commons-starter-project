import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import RedoxApi from '../../apis/redox';
import Db from '../../db';
import Clinic from '../../models/clinic';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockPatient,
  createPatient,
  mockRedoxGetPatientEncounters,
  mockRedoxTokenFetch,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient encounters', () => {
  let redoxApi: RedoxApi;
  let db: Db;
  let patient: Patient;
  let user: User;
  let clinic: Clinic;

  const userRole = 'physician';

  beforeEach(async () => {
    redoxApi = await RedoxApi.get();
    db = await Db.get();
    await Db.clear();
    mockRedoxTokenFetch();

    clinic = await Clinic.create({
      departmentId: 1,
      name: 'Center Zero',
    });
    user = await User.create({
      email: 'a@b.com',
      userRole,
      homeClinicId: clinic.id,
    });
    patient = await createPatient(createMockPatient(1, clinic.id), user.id);
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('when a patient has no encounters', () => {
    it('returns an empty response', async () => {
      const query = `{
        patientEncounters(patientId: "${patient.id}") {
          encounterType
          providerName
        }
      }`;

      mockRedoxGetPatientEncounters([]);

      const result = await graphql(schema, query, null, { redoxApi, db, userRole });
      expect(cloneDeep(result.data!.patientEncounters)).toMatchObject([]);
    });
  });

  describe('when a patient has encounters', () => {
    it('returns patient encounters', async () => {
      const query = `{
        patientEncounters(patientId: "${patient.id}") {
          encounterType
        }
      }`;

      mockRedoxGetPatientEncounters([{
        Type: {
          Code: '99222',
          CodeSystem: '2.16.840.1.113883.6.12',
          CodeSystemName: 'CPT',
          Name: 'InPatient Admission',
        },
        Providers: [],
        Locations: [],
        ReasonForVisit: [],
        Diagnosis: [],
      }]);

      const result = await graphql(schema, query, null, { redoxApi, db, userRole });
      expect(cloneDeep(result.data!.patientEncounters)).toMatchObject([{
        encounterType: 'InPatient Admission',
      }]);
    });
  });
});
