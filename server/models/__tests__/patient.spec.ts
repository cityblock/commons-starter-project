import Db from '../../db';
import {
  createMockPatient,
  createPatient,
} from '../../spec-helpers';
import Patient from '../patient';
import User from '../user';

const userRole = 'physician';

describe('patient model', () => {
  let db: Db;

  beforeEach(async () => {
    db = await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', () => {
    it('should create and retrieve a patient', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      expect(patient).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
      const patientById = await Patient.get(patient.id);
      expect(patientById).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
    });

    it('should throw an error if a patient does not exist for the id', async () => {
      const fakeId = 'fakeId';
      await expect(Patient.get(fakeId)).rejects.toMatch('No such patient: fakeId');
    });
  });

  describe('edit', () => {
    it('should edit patient', async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      const patient = await createPatient(createMockPatient(123), user.id);
      expect(patient).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
      const patientEdit = await Patient.edit(
        {
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          zip: 12345,
          gender: 'F',
        },
        patient.id,
      );
      expect(patientEdit).toMatchObject({
        id: patient.id,
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '02/02/1902',
        zip: 12345,
        gender: 'F',
      });
    });
  });

  describe('setup', () => {
    it('should setup patient', async () => {
      const patient = await Patient.setup({
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        dateOfBirth: '02/02/1902',
        zip: 12345,
        gender: 'F',
        homeClinicId: '1',
        consentToCall: false,
        consentToText: false,
        language: 'en',
      });
      expect(patient).toMatchObject({
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        dateOfBirth: '02/02/1902',
        zip: 12345,
        gender: 'F',
        consentToCall: false,
        consentToText: false,
        language: 'en',
      });
    });
  });

  describe('patients', () => {
    beforeEach(async () => {
      const user = await User.create({
        email: 'care@care.com',
        userRole,
        homeClinicId: '1',
      });
      await createPatient(createMockPatient(123), user.id);
      await createPatient(createMockPatient(234), user.id);
    });

    it('should fetch patients', async () => {
      expect(await Patient.getAll({ pageNumber: 0, pageSize: 10 })).toMatchObject({
        results: [
          {
            athenaPatientId: 123,
          },
          {
            athenaPatientId: 234,
          },
        ],
        total: 2,
      });
    });

    it('should fetch a limited set of patients', async () => {
      expect(await Patient.getAll({ pageNumber: 0, pageSize: 1 })).toMatchObject({
        results: [
          {
            athenaPatientId: 123,
          },
        ],
        total: 2,
      });
      expect(await Patient.getAll({ pageNumber: 1, pageSize: 1 })).toMatchObject({
        results: [
          {
            athenaPatientId: 234,
          },
        ],
        total: 2,
      });
    });

    it('should fetch by athenaPatientId', async () => {
      expect(await Patient.getBy('athenaPatientId', '123')).toMatchObject({
        athenaPatientId: 123,
      });
    });

    it('should return null if calling getBy without a matchable param', async () => {
      expect(await Patient.getBy('athenaPatientId')).toBeNull();
    });

    it('should return null if a patient cannot be found for the matchable param', async () => {
      expect(await Patient.getBy('athenaPatientId', '99999')).toBeNull();
    });
  });
});
