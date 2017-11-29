import * as uuid from 'uuid/v4';
import Db from '../../db';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
} from '../../spec-helpers';
import Clinic from '../clinic';
import { adminTasksConcernTitle } from '../concern';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import User from '../user';

const userRole = 'physician';

describe('patient model', () => {
  let clinic: Clinic;

  beforeEach(async () => {
    await Db.get();
    await Db.clear();

    clinic = await Clinic.create(createMockClinic());
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', () => {
    it('should create and retrieve a patient', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
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

    it('should not create a user with an invalid clinic id', async () => {
      const fakeClinicId = uuid();
      const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;
      const user = await User.create(createMockUser(11, clinic.id, userRole));

      await createPatient(createMockPatient(11, fakeClinicId), user.id).catch(e => {
        expect(e.detail).toEqual(message);
      });
    });

    it('should throw an error if a patient does not exist for the id', async () => {
      const fakeId = uuid();
      await expect(Patient.get(fakeId)).rejects.toMatch(`No such patient: ${fakeId}`);
    });
  });

  describe('edit', () => {
    it('should edit patient', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await createPatient(createMockPatient(123, clinic.id), user.id);
      expect(patient).toMatchObject({
        id: patient.id,
        athenaPatientId: 123,
      });
      const patientEdit = await Patient.edit(
        {
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          zip: '12345',
          gender: 'F',
        },
        patient.id,
      );
      expect(patientEdit).toMatchObject({
        id: patient.id,
        firstName: 'first',
        lastName: 'last',
        dateOfBirth: '02/02/1902',
        zip: '12345',
        gender: 'F',
      });
    });
  });

  describe('setup', async () => {
    it('should setup patient', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await Patient.setup(
        {
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          zip: '12345',
          gender: 'F',
          homeClinicId: clinic.id,
          consentToCall: false,
          consentToText: false,
          language: 'en',
        },
        user.id,
      );

      expect(patient).toMatchObject({
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        dateOfBirth: '02/02/1902',
        zip: '12345',
        gender: 'F',
        consentToCall: false,
        consentToText: false,
        language: 'en',
      });
    });

    it('should give the patient an administrative tasks concern', async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      const patient = await Patient.setup(
        {
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          zip: '12345',
          gender: 'F',
          homeClinicId: clinic.id,
          consentToCall: false,
          consentToText: false,
          language: 'en',
        },
        user.id,
      );
      const patientConcerns = await PatientConcern.getForPatient(patient.id);

      expect(patientConcerns.length).toEqual(1);
      expect(patientConcerns[0].concern.title).toEqual(adminTasksConcernTitle);
    });
  });

  describe('patients', () => {
    beforeEach(async () => {
      const user = await User.create(createMockUser(11, clinic.id, userRole));
      await createPatient(createMockPatient(123, clinic.id), user.id);
      await createPatient(createMockPatient(234, clinic.id), user.id);
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
      expect(await Patient.getBy('athenaPatientId')).toBeFalsy();
    });

    it('should return null if a patient cannot be found for the matchable param', async () => {
      expect(await Patient.getBy('athenaPatientId', '99999')).toBeFalsy();
    });
  });
});
