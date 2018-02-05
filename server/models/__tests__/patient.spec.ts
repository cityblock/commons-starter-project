import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { adminTasksConcernTitle } from '../../lib/consts';
import {
  createMockClinic,
  createMockPatient,
  createMockUser,
  createPatient,
  setupComputedPatientList,
  setupPatientsNewToCareTeam,
  setupPatientsWithMissingInfo,
  setupPatientsWithNoRecentEngagement,
  setupPatientsWithOutOfDateMAP,
  setupPatientsWithPendingSuggestions,
  setupUrgentTasks,
} from '../../spec-helpers';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);

  return { clinic };
}

describe('patient model', () => {
  beforeEach(async () => {
    await Db.get();
    await Db.clear();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', () => {
    it('should create and retrieve a patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

        const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
        expect(patient).toMatchObject({
          id: patient.id,
          athenaPatientId: 123,
        });
        const patientById = await Patient.get(patient.id, txn);
        expect(patientById).toMatchObject({
          id: patient.id,
          athenaPatientId: 123,
        });
      });
    });

    it('should not create a user with an invalid clinic id', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const fakeClinicId = uuid();
        const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);

        await createPatient(createMockPatient(11, fakeClinicId), user.id, txn).catch(e => {
          expect(e.detail).toEqual(message);
        });
      });
    });

    it('should throw an error if a patient does not exist for the id', async () => {
      await transaction(Patient.knex(), async txn => {
        const fakeId = uuid();
        await expect(Patient.get(fakeId, txn)).rejects.toMatch(`No such patient: ${fakeId}`);
      });
    });
  });

  describe('edit', () => {
    it('should edit patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
        const birthday = new Date('02/02/1902');
        expect(patient).toMatchObject({
          id: patient.id,
          athenaPatientId: 123,
        });
        const patientEdit = await Patient.edit(
          {
            firstName: 'first',
            lastName: 'last',
            dateOfBirth: '02/02/1902',
          },
          patient.id,
          txn,
        );
        expect(patientEdit).toMatchObject({
          id: patient.id,
          firstName: 'first',
          lastName: 'last',
          dateOfBirth: birthday,
        });
      });
    });
  });

  describe('setup', async () => {
    it('should setup patient', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const birthday = new Date('02/02/1902');
        const patient = await Patient.setup(
          {
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
            dateOfBirth: '02/02/1902',
            homeClinicId: clinic.id,
            consentToCall: false,
            consentToText: false,
          },
          {
            gender: 'female',
            language: 'en',
          },
          user.id,
          txn,
        );

        expect(patient).toMatchObject({
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: birthday,
          consentToCall: false,
          consentToText: false,
        });
      });
    });

    it('should give the patient an administrative tasks concern', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await Patient.setup(
          {
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
            dateOfBirth: '02/02/1902',
            homeClinicId: clinic.id,
            consentToCall: false,
            consentToText: false,
          },
          {
            gender: 'female',
            language: 'en',
          },
          user.id,
          txn,
        );
        const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);

        expect(patientConcerns.length).toEqual(1);
        expect(patientConcerns[0].concern.title).toEqual(adminTasksConcernTitle);
      });
    });

    it('should create the initial ComputedPatientStatus', async () => {
      await transaction(Patient.knex(), async txn => {
        const { clinic } = await setup(txn);
        const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
        const patient = await Patient.setup(
          {
            firstName: 'first',
            middleName: 'middle',
            lastName: 'last',
            dateOfBirth: '02/02/1902',
            homeClinicId: clinic.id,
            consentToCall: false,
            consentToText: false,
          },
          {
            gender: 'female',
            language: 'en',
          },
          user.id,
          txn,
        );

        const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

        expect(computedPatientStatus).not.toBeNull();
        expect(computedPatientStatus!.updatedById).toEqual(user.id);
      });
    });
  });

  describe('patients', () => {
    interface IPatientsSetup {
      user: User;
      patient1: Patient;
      patient2: Patient;
    }

    async function patientsSetup(txn: Transaction): Promise<IPatientsSetup> {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient1 = await createPatient(createMockPatient(123, clinic.id), user.id, txn);
      const patient2 = await createPatient(createMockPatient(234, clinic.id), user.id, txn);

      return { user, patient1, patient2 };
    }

    it('should fetch patients', async () => {
      await transaction(Patient.knex(), async txn => {
        await patientsSetup(txn);

        expect(await Patient.getAll({ pageNumber: 0, pageSize: 10 }, txn)).toMatchObject({
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
    });

    it('should fetch all patient ids', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient1, patient2 } = await patientsSetup(txn);
        const patientIds = await Patient.getAllIds(txn);

        expect(patientIds.length).toEqual(2);
        expect(patientIds).toContain(patient1.id);
        expect(patientIds).toContain(patient2.id);
      });
    });

    it('should fetch a limited set of patients', async () => {
      await transaction(Patient.knex(), async txn => {
        await patientsSetup(txn);

        expect(await Patient.getAll({ pageNumber: 0, pageSize: 1 }, txn)).toMatchObject({
          results: [
            {
              athenaPatientId: 123,
            },
          ],
          total: 2,
        });
        expect(await Patient.getAll({ pageNumber: 1, pageSize: 1 }, txn)).toMatchObject({
          results: [
            {
              athenaPatientId: 234,
            },
          ],
          total: 2,
        });
      });
    });

    it('should fetch by athenaPatientId', async () => {
      await transaction(Patient.knex(), async txn => {
        await patientsSetup(txn);
        expect(
          await Patient.getBy({ fieldName: 'athenaPatientId', field: '123' }, txn),
        ).toMatchObject({
          athenaPatientId: 123,
        });
      });
    });

    it('should return null if calling getBy without a matchable param', async () => {
      await transaction(Patient.knex(), async txn => {
        await patientsSetup(txn);
        expect(await Patient.getBy({ fieldName: 'athenaPatientId' }, txn)).toBeFalsy();
      });
    });

    it('should return null if a patient cannot be found for the matchable param', async () => {
      await transaction(Patient.knex(), async txn => {
        await patientsSetup(txn);
        expect(
          await Patient.getBy({ fieldName: 'athenaPatientId', field: '99999' }, txn),
        ).toBeFalsy();
      });
    });
  });

  describe('search', () => {
    interface ISearchSetup {
      user: User;
      jonSnow: Patient;
    }

    async function searchSetup(txn: Transaction): Promise<ISearchSetup> {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      await Patient.setup(
        createMockPatient(14, clinic.id, 'Robb', 'Stark'),
        {
          gender: 'female',
          language: 'en',
        },
        user.id,
        txn,
      );

      const jonSnow = await createPatient(
        createMockPatient(11, clinic.id, 'Jon', 'Snow'),
        user.id,
        txn,
      );

      await createPatient(createMockPatient(12, clinic.id, 'Arya', 'Stark'), user.id, txn);
      await createPatient(createMockPatient(13, clinic.id, 'Sansa', 'Stark'), user.id, txn);

      return { user, jonSnow };
    }

    it('returns single result', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await searchSetup(txn);
        const query = 'jon';
        expect(
          await Patient.search(query, { pageNumber: 0, pageSize: 1 }, user.id, txn),
        ).toMatchObject({
          results: [
            {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
              patientInfo: {
                gender: 'male',
                language: 'en',
              },
            },
          ],
          total: 1,
        });
      });
    });

    it('returns multiple matching results', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await searchSetup(txn);
        const query = 'stark';
        expect(
          await Patient.search(query, { pageNumber: 0, pageSize: 3 }, user.id, txn),
        ).toMatchObject({
          results: [
            {
              lastName: 'Stark',
              userCareTeam: true,
            },
            {
              lastName: 'Stark',
              userCareTeam: true,
            },
            {
              firstName: 'Robb',
              lastName: 'Stark',
              userCareTeam: false,
            },
          ],
          total: 3,
        });
      });
    });

    it('returns a close matching result', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await searchSetup(txn);
        const query = 'john snow';
        expect(
          await Patient.search(query, { pageNumber: 0, pageSize: 1 }, user.id, txn),
        ).toMatchObject({
          results: [
            {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
            },
          ],
          total: 1,
        });
      });
    });

    it('returns empty array if no results found', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await searchSetup(txn);
        const query = 'daenerys';
        expect(
          await Patient.search(query, { pageNumber: 0, pageSize: 1 }, user.id, txn),
        ).toMatchObject({
          results: [],
          total: 0,
        });
      });
    });

    it('does not search for empty string', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user } = await searchSetup(txn);
        await expect(
          Patient.search('', { pageNumber: 0, pageSize: 1 }, user.id, txn),
        ).rejects.toMatch('Must provide a search term');
      });
    });

    it('does not explode if SQL injection attack attempted', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user, jonSnow } = await searchSetup(txn);
        const query = 'DROP TABLE patient;';
        await Patient.search(query, { pageNumber: 0, pageSize: 1 }, user.id, txn);

        const princeWhoWasPromised = await Patient.get(jonSnow.id, txn);

        expect(princeWhoWasPromised).toMatchObject({
          id: jonSnow.id,
          firstName: 'Jon',
          lastName: 'Snow',
        });
      });
    });
  });

  describe('dashboard patient list getters', () => {
    it('returns patients on care team with urgent tasks', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user, patient1, patient5 } = await setupUrgentTasks(txn);

        const { total, results } = await Patient.getPatientsWithUrgentTasks(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        const resultNames = results.map(r => r.firstName);

        expect(total).toBe(2);
        expect(resultNames).toEqual([patient1.firstName, patient5.firstName]);
      });
    });

    it('returns patients that are new to care team', async () => {
      await transaction(Patient.knex(), async txn => {
        const { user, patient1 } = await setupPatientsNewToCareTeam(txn);

        const { total, results } = await Patient.getPatientsNewToCareTeam(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
      });
    });

    it('returns patients on care team with pending MAP suggestions', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient1, user } = await setupPatientsWithPendingSuggestions(txn);

        const { total, results } = await Patient.getPatientsWithPendingSuggestions(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
      });
    });

    it('returns patients on care team with missing demographic information', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient, user } = await setupPatientsWithMissingInfo(txn);

        const { total, results } = await Patient.getPatientsWithMissingInfo(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient.id,
          firstName: patient.firstName,
          patientInfo: {
            gender: null,
            language: null,
          },
        });
      });
    });

    it('returns patients on care team with no recent engagement', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient1, user } = await setupPatientsWithNoRecentEngagement(txn);

        const { total, results } = await Patient.getPatientsWithNoRecentEngagement(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
      });
    });

    it('returns patients on care team with no recent MAP updates', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient1, user } = await setupPatientsWithOutOfDateMAP(txn);

        const { total, results } = await Patient.getPatientsWithOutOfDateMAP(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
      });
    });

    it('returns computed list of patients for a given answer id', async () => {
      await transaction(Patient.knex(), async txn => {
        const { patient1, user, answer } = await setupComputedPatientList(txn);

        const { total, results } = await Patient.getPatientsForComputedList(
          {
            pageNumber: 0,
            pageSize: 10,
          },
          user.id,
          answer.id,
          txn,
        );

        expect(total).toBe(1);
        expect(results[0]).toMatchObject({
          id: patient1.id,
          firstName: patient1.firstName,
        });
      });
    });
  });
});
