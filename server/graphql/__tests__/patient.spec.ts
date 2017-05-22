import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import AthenaApi from '../../apis/athena';
import Db from '../../db';
import Patient from '../../models/patient';
import User from '../../models/user';
import {
  createMockAthenaPatient,
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
  const userRole = 'physician';
  const homeClinicId = '1';

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    db = await Db.get();
    await Db.clear();
    mockAthenaTokenFetch();

    user = await User.create({
      email: 'a@b.com',
      password: 'password1',
      userRole,
      homeClinicId,
    });
    patient = await Patient.create({
      athenaPatientId: 1,
      firstName: 'Constance',
      lastName: 'Blanton',
      homeClinicId,
    }, user.id);
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
          id, firstName, lastName, athenaPatientId
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole });
      expect(cloneDeep(result.data!.patient)).toMatchObject({
        id: patient.id,
        firstName: 'Constance',
        lastName: 'Blanton',
        athenaPatientId: 1,
      });
    });

  });

  describe('resolvePatientHealthRecord', () => {

    it('returns patientHealthRecord', async () => {
      const query = `{
        patientHealthRecord(patientId: "${patient.id}") {
          id, firstName, lastName, athenaPatientId
        }
      }`;

      mockAthenaGetPatient(1, createMockAthenaPatient(1, 'Constance', 'Blanton'));

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
      expect(cloneDeep(result.data!.patientHealthRecord)).toMatchObject({
        id: patient.id,
        firstName: 'Constance',
        lastName: 'Blanton',
        athenaPatientId: 1,
      });
    });

  });
});
