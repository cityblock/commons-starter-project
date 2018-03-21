import { transaction, Transaction } from 'objection';
import * as uuid from 'uuid/v4';
import Db from '../../db';
import { adminTasksConcernTitle } from '../../lib/consts';
import {
  createMockClinic,
  createMockUser,
  createPatient,
  setupComputedPatientList,
  setupPatientsForPanelFilter,
  setupPatientsNewToCareTeam,
  setupPatientsWithMissingInfo,
  setupPatientsWithNoRecentEngagement,
  setupPatientsWithOpenCBOReferrals,
  setupPatientsWithOutOfDateMAP,
  setupPatientsWithPendingSuggestions,
  setupUrgentTasks,
} from '../../spec-helpers';
import CareTeam from '../care-team';
import Clinic from '../clinic';
import ComputedPatientStatus from '../computed-patient-status';
import Patient from '../patient';
import PatientConcern from '../patient-concern';
import PatientDataFlag from '../patient-data-flag';
import PatientState from '../patient-state';
import User from '../user';

const userRole = 'physician';

interface ISetup {
  clinic: Clinic;
}

async function setup(txn: Transaction): Promise<ISetup> {
  const clinic = await Clinic.create(createMockClinic(), txn);

  return { clinic };
}

interface IPatientsSetup {
  user: User;
  patient1: Patient;
  patient2: Patient;
}

async function patientsSetup(txn: Transaction): Promise<IPatientsSetup> {
  const { clinic } = await setup(txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  const patient1 = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
  const patient2 = await createPatient({ cityblockId: 234, homeClinicId: clinic.id }, txn);

  return { user, patient1, patient2 };
}

interface ISearchSetup {
  user: User;
  jonSnow: Patient;
}

async function searchSetup(txn: Transaction): Promise<ISearchSetup> {
  const { clinic } = await setup(txn);
  const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
  await createPatient(
    {
      cityblockId: 123,
      homeClinicId: clinic.id,
      firstName: 'Robb',
      lastName: 'Stark',
    },
    txn,
  );

  const jonSnow = await createPatient(
    {
      cityblockId: 234,
      homeClinicId: clinic.id,
      firstName: 'Jon',
      lastName: 'Snow',
      userId: user.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 345,
      homeClinicId: clinic.id,
      firstName: 'Arya',
      lastName: 'Stark',
      userId: user.id,
    },
    txn,
  );
  await createPatient(
    {
      cityblockId: 456,
      homeClinicId: clinic.id,
      firstName: 'Sansa',
      lastName: 'Stark',
      userId: user.id,
    },
    txn,
  );

  return { user, jonSnow };
}

describe('patient model', () => {
  let txn = null as any;

  beforeEach(async () => {
    await Db.get();
    txn = await transaction.start(Patient.knex());
  });

  afterEach(async () => {
    await txn.rollback();
  });

  afterAll(async () => {
    await Db.release();
  });

  describe('get', () => {
    it('should create and retrieve a patient', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      expect(patient).toMatchObject({
        id: patient.id,
      });
      const patientById = await Patient.get(patient.id, txn);
      expect(patientById).toMatchObject({
        id: patient.id,
      });
    });

    it('should not create a user with an invalid clinic id', async () => {
      const fakeClinicId = uuid();
      const message = `Key (homeClinicId)=(${fakeClinicId}) is not present in table "clinic".`;

      await createPatient({ cityblockId: 11, homeClinicId: fakeClinicId }, txn).catch(e => {
        expect(e.detail).toEqual(message);
      });
    });

    it('should throw an error if a patient does not exist for the id', async () => {
      const fakeId = uuid();
      await expect(Patient.get(fakeId, txn)).rejects.toMatch(`No such patient: ${fakeId}`);
    });
  });

  describe('getById', () => {
    it('should retrieve a patient by id', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const fetchedPatient = await Patient.getById(patient.id, txn);

      expect(fetchedPatient).toMatchObject(patient);
    });

    it('should return null when getting a patient by an unknown id', async () => {
      const fetchedPatient = await Patient.getById(uuid(), txn);

      expect(fetchedPatient).toBeNull();
    });
  });

  describe('edit', () => {
    it('should edit patient', async () => {
      const { clinic } = await setup(txn);
      const patient = await createPatient({ cityblockId: 123, homeClinicId: clinic.id }, txn);
      const birthday = new Date('02/02/1902');
      expect(patient).toMatchObject({
        id: patient.id,
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

  describe('create', async () => {
    it('should create a patient', async () => {
      const { clinic } = await setup(txn);
      const birthday = new Date('02/02/1902');
      const patientUuid = uuid();
      const patient = await Patient.create(
        {
          patientId: patientUuid,
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );

      expect(patient).toMatchObject({
        id: patientUuid,
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        dateOfBirth: birthday,
      });
    });

    it('should give the patient an administrative tasks concern', async () => {
      const { clinic } = await setup(txn);
      const patient = await Patient.create(
        {
          patientId: uuid(),
          cityblockId: 12345,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );
      const patientConcerns = await PatientConcern.getForPatient(patient.id, txn);

      expect(patientConcerns.length).toEqual(1);
      expect(patientConcerns[0].concern.title).toEqual(adminTasksConcernTitle);
    });

    it('should create the initial ComputedPatientStatus', async () => {
      const { clinic } = await setup(txn);
      const patient = await Patient.create(
        {
          patientId: uuid(),
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'male',
          language: 'english',
        },
        txn,
      );
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus).not.toBeNull();
    });

    it('should create the initial PatientState', async () => {
      const { clinic } = await setup(txn);
      const patient = await Patient.create(
        {
          patientId: uuid(),
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'male',
          language: 'english',
        },
        txn,
      );
      const patientState = await PatientState.getForPatient(patient.id, txn);

      expect(patientState).not.toBeNull();
      expect(patientState!.currentState).toEqual('attributed');
    });
  });

  describe('updateFromAttribution', async () => {
    it('should update a patient', async () => {
      const { clinic } = await setup(txn);
      const birthday = new Date('02/02/1902');
      const patientId = uuid();
      const patient = await Patient.create(
        {
          patientId,
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );

      expect(patient).toMatchObject({
        id: patientId,
        firstName: 'first',
        middleName: 'middle',
        lastName: 'last',
        dateOfBirth: birthday,
      });

      await Patient.updateFromAttribution(
        {
          patientId,
          firstName: 'New First Name',
        },
        txn,
      );

      const fetchedPatient = await Patient.get(patient.id, txn);
      expect(fetchedPatient.firstName).toEqual('New First Name');
    });

    it('should clear any PatientDataFlags', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patientId = uuid();
      await Patient.create(
        {
          patientId,
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );
      await PatientDataFlag.create({ patientId, userId: user.id, fieldName: 'firstName' }, txn);

      const patientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
      expect(patientDataFlags.length).toEqual(1);

      await Patient.updateFromAttribution(
        {
          patientId,
          firstName: 'A Change That Does Not Matter',
        },
        txn,
      );

      const refetchedPatientDataFlags = await PatientDataFlag.getAllForPatient(patientId, txn);
      expect(refetchedPatientDataFlags.length).toEqual(0);
    });

    it('should reset core identity verification', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patientId = uuid();
      await Patient.create(
        {
          patientId,
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );
      await Patient.coreIdentityVerify(patientId, user.id, txn);

      const patient = await Patient.get(patientId, txn);
      expect(patient.coreIdentityVerifiedById).toEqual(user.id);
      expect(patient.coreIdentityVerifiedAt).not.toBeNull();

      await Patient.updateFromAttribution(
        {
          patientId,
          firstName: 'A Change That Does Not Matter',
        },
        txn,
      );

      const refetchedPatient = await Patient.get(patientId, txn);
      expect(refetchedPatient.coreIdentityVerifiedById).toBeNull();
      expect(refetchedPatient.coreIdentityVerifiedAt).toBeNull();
    });

    it('should update ComputedPatientStatus', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patientId = uuid();
      await Patient.create(
        {
          patientId,
          cityblockId: 123456,
          firstName: 'first',
          middleName: 'middle',
          lastName: 'last',
          dateOfBirth: '02/02/1902',
          homeClinicId: clinic.id,
          gender: 'female',
          language: 'english',
        },
        txn,
      );
      await Patient.coreIdentityVerify(patientId, user.id, txn);

      await ComputedPatientStatus.updateForPatient(patientId, user.id, txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patientId, txn);
      expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(true);

      await Patient.updateFromAttribution(
        {
          patientId,
          firstName: 'A Change That Does Not Matter',
        },
        txn,
      );

      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patientId,
        txn,
      );
      expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(false);
    });
  });

  describe('coreIdentityVerify', () => {
    it('updates the computedPatientStatus', async () => {
      const { clinic } = await setup(txn);
      const user = await User.create(createMockUser(11, clinic.id, userRole), txn);
      const patient = await createPatient({ cityblockId: 987, homeClinicId: clinic.id }, txn);
      const computedPatientStatus = await ComputedPatientStatus.getForPatient(patient.id, txn);

      expect(computedPatientStatus!.isCoreIdentityVerified).toEqual(false);

      await Patient.coreIdentityVerify(patient.id, user.id, txn);
      const refetchedComputedPatientStatus = await ComputedPatientStatus.getForPatient(
        patient.id,
        txn,
      );

      expect(refetchedComputedPatientStatus!.isCoreIdentityVerified).toEqual(true);
    });
  });

  describe('patients', () => {
    it('should fetch patients', async () => {
      const { patient1, patient2 } = await patientsSetup(txn);
      const patients = await Patient.getAll({ pageNumber: 0, pageSize: 10 }, txn);
      expect(patients.results).toContainEqual(patient1);
      expect(patients.results).toContainEqual(patient2);
    });

    it('should fetch all patient ids', async () => {
      const { patient1, patient2 } = await patientsSetup(txn);
      const patientIds = await Patient.getAllIds(txn);

      expect(patientIds.length).toEqual(2);
      expect(patientIds).toContain(patient1.id);
      expect(patientIds).toContain(patient2.id);
    });

    it('should fetch a limited set of patients', async () => {
      const { patient1, patient2 } = await patientsSetup(txn);

      expect(await Patient.getAll({ pageNumber: 0, pageSize: 1 }, txn)).toMatchObject({
        results: [
          {
            id: patient1.id,
          },
        ],
        total: 2,
      });
      expect(await Patient.getAll({ pageNumber: 1, pageSize: 1 }, txn)).toMatchObject({
        results: [
          {
            id: patient2.id,
          },
        ],
        total: 2,
      });
    });
  });

  describe('filter', () => {
    it('returns single result for zip code 10001', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { zip: '10001' },
          false,
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            firstName: 'Mark',
            lastName: 'Man',
            patientInfo: {
              gender: 'male',
              language: 'en',
              primaryAddress: {
                zip: '10001',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns two results for zip code 11211 for first user', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const patientResults = await Patient.filter(
        user.id,
        { pageNumber: 0, pageSize: 10 },
        { zip: '11211' },
        false,
        txn,
      );
      expect(patientResults.total).toBe(2);
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Robb',
          lastName: 'Stark',
        }),
      );
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Jacobs',
        }),
      );
    });

    it('returns single result age range 19 and under', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(user.id, { pageNumber: 0, pageSize: 10 }, { ageMax: 19 }, false, txn),
      ).toMatchObject({
        results: [
          {
            firstName: 'Robb',
            lastName: 'Stark',
            patientInfo: {
              gender: 'male',
              language: 'en',
              primaryAddress: {
                zip: '11211',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns two results for age range 20 to 24', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const patientResults = await Patient.filter(
        user.id,
        { pageNumber: 0, pageSize: 10 },
        { ageMin: 20, ageMax: 24 },
        false,
        txn,
      );
      expect(patientResults.total).toBe(2);
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Maxie',
          lastName: 'Jacobs',
        }),
      );
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Jacobs',
        }),
      );
    });

    it('returns single result age range 80 and older', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(user.id, { pageNumber: 0, pageSize: 10 }, { ageMin: 80 }, false, txn),
      ).toMatchObject({
        results: [
          {
            firstName: 'Mark',
            lastName: 'Man',
            patientInfo: {
              gender: 'male',
              language: 'en',
              primaryAddress: {
                zip: '10001',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns single result for second user and no filters', async () => {
      const { user2 } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(user2.id, { pageNumber: 0, pageSize: 10 }, {}, false, txn),
      ).toMatchObject({
        results: [
          {
            firstName: 'Juanita',
            lastName: 'Jacobs',
            patientInfo: {
              gender: 'female',
              language: 'en',
              primaryAddress: {
                zip: '11211',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns two results for female gender', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      const patientResults = await Patient.filter(
        user.id,
        { pageNumber: 0, pageSize: 10 },
        { gender: 'female' },
        false,
        txn,
      );
      expect(patientResults.total).toBe(2);
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Maxie',
          lastName: 'Jacobs',
        }),
      );
      expect(patientResults.results).toContainEqual(
        expect.objectContaining({
          firstName: 'Jane',
          lastName: 'Jacobs',
        }),
      );
    });

    it('returns single result for female in zip code 11211', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { gender: 'female', zip: '11211' },
          false,
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            firstName: 'Jane',
            lastName: 'Jacobs',
            patientInfo: {
              gender: 'female',
              language: 'en',
              primaryAddress: {
                zip: '11211',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns single result for female in zip code 11211 and age between 19 and 30', async () => {
      const { user } = await setupPatientsForPanelFilter(txn);
      expect(
        await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { gender: 'female', zip: '11211', ageMin: 19, ageMax: 30 },
          false,
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            firstName: 'Jane',
            lastName: 'Jacobs',
            patientInfo: {
              gender: 'female',
              language: 'en',
              primaryAddress: {
                zip: '11211',
              },
            },
          },
        ],
        total: 1,
      });
    });

    it('returns a single result when filtering on careWorkerId', async () => {
      const { user, user3, patient5 } = await setupPatientsForPanelFilter(txn);
      await CareTeam.create({ patientId: patient5.id, userId: user.id }, txn);
      expect(
        await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { careWorkerId: user3.id },
          false,
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            firstName: 'Juanita',
            lastName: 'Jacobs',
            patientInfo: {
              gender: 'female',
              language: 'en',
            },
          },
        ],
        total: 1,
      });
    });

    it('returns a single result when filtering for enrolled patient status', async () => {
      const { user, user3, patient5 } = await setupPatientsForPanelFilter(txn);
      await CareTeam.create({ patientId: patient5.id, userId: user.id }, txn);
      expect(
        await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { careWorkerId: user3.id },
          false,
          txn,
        ),
      ).toMatchObject({
        results: [
          {
            firstName: 'Juanita',
            lastName: 'Jacobs',
            patientInfo: {
              gender: 'female',
              language: 'en',
            },
          },
        ],
        total: 1,
      });
    });

    describe('with permissions that do not allow filtering entire patient panel', () => {
      it('still only returns results from care team when showAllMembers is true', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const patients = await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { gender: 'female', showAllPatients: true },
          false,
          txn,
        );
        expect(patients.total).toEqual(2);
      });
    });

    describe('with permissions that allow filtering entire patient panel', () => {
      it('returns results from all members when showAllMembers is true', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const patients = await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { gender: 'female', showAllPatients: true },
          true,
          txn,
        );
        expect(patients.total).toEqual(3);
      });

      it('still only returns results from care team when showAllMembers is false', async () => {
        const { user } = await setupPatientsForPanelFilter(txn);
        const patients = await Patient.filter(
          user.id,
          { pageNumber: 0, pageSize: 10 },
          { gender: 'female', showAllPatients: false },
          true,
          txn,
        );
        expect(patients.total).toEqual(2);
      });
    });
  });

  describe('search', () => {
    it('returns single result', async () => {
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

    it('returns multiple matching results', async () => {
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

    it('returns a close matching result', async () => {
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

    it('returns empty array if no results found', async () => {
      const { user } = await searchSetup(txn);
      const query = 'daenerys';
      expect(
        await Patient.search(query, { pageNumber: 0, pageSize: 1 }, user.id, txn),
      ).toMatchObject({
        results: [],
        total: 0,
      });
    });

    it('does not search for empty string', async () => {
      const { user } = await searchSetup(txn);
      await expect(
        Patient.search('', { pageNumber: 0, pageSize: 1 }, user.id, txn),
      ).rejects.toMatch('Must provide a search term');
    });

    it('does not explode if SQL injection attack attempted', async () => {
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

  describe('dashboard patient list getters', () => {
    it('returns patients on care team with urgent tasks', async () => {
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

    it('returns patients that are new to care team', async () => {
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

    it('returns patients on care team with pending MAP suggestions', async () => {
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

    it('returns patients on care team with missing demographic information', async () => {
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

    it('returns patients on care team with no recent engagement', async () => {
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

    it('returns patients on care team with no recent MAP updates', async () => {
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

    it('returns patients on care team with open CBO referrals', async () => {
      const { patient1, user, patient5 } = await setupPatientsWithOpenCBOReferrals(txn);

      const { total, results } = await Patient.getPatientsWithOpenCBOReferrals(
        { pageNumber: 0, pageSize: 10 },
        user.id,
        txn,
      );

      expect(total).toBe(2);
      expect(results[0]).toMatchObject({
        id: patient1.id,
        firstName: patient1.firstName,
      });
      expect(results[1]).toMatchObject({
        id: patient5.id,
        firstName: patient5.firstName,
      });
    });

    it('returns computed list of patients for a given answer id', async () => {
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

  describe('getPatientIdForResource', async () => {
    it('returns passed patient id', async () => {
      const patientId = 'aryaStark';

      expect(Patient.getPatientIdForResource(patientId)).toBe(patientId);
    });
  });
});
