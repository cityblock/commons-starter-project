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
import { getFullPatient } from '../patient-resolver';

describe('patient', () => {

  let athenaApi: AthenaApi = null as any;
  let db: Db = null as any;
  let patient = null as any;
  let user = null as any;
  const userRole = 'physician';

  beforeEach(async () => {
    athenaApi = await AthenaApi.get();
    db = await Db.get();
    await Db.clear();
    mockAthenaTokenFetch();

    user = await User.create({
      email: 'a@b.com',
      password: 'password1',
      userRole,
    });
    patient = await Patient.create({
      athenaPatientId: 1,
      firstName: 'Constance',
      lastName: 'Blanton',
    });
  });

  afterEach(async () => {
    restoreAthenaFetch();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('individual patient', () => {

    it('returns patient', async () => {
      const query = `{
        patient(patientId: "${patient.id}") {
          id, firstName, lastName, athenaPatientId
        }
      }`;

      mockAthenaGetPatient(1, createMockAthenaPatient(1, 'Constance', 'Blanton'));

      const result = await graphql(schema, query, null, { athenaApi, db, userRole });
      expect(cloneDeep(result.data!.patient)).toMatchObject({
        id: patient.id,
        firstName: 'Constance',
        lastName: 'Blanton',
        athenaPatientId: 1,
      });
    });

    it('returns a full patient', async () => {
      mockAthenaGetPatient(1, createMockAthenaPatient(1, 'Constance', 'Blanton'));
      const fullPatient = await getFullPatient(patient, athenaApi);

      expect(fullPatient).toMatchObject({
        athenaPatientId: 1,
        id: patient.id,
        firstName: 'Constance',
        lastName: 'Blanton',
      });
    });

  });
});
