import { graphql } from 'graphql';
import { cloneDeep } from 'lodash';
import { transaction } from 'objection';
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
  setupUrgentTasks,
} from '../../spec-helpers';
import schema from '../make-executable-schema';

describe('patient', () => {
  let redoxApi: RedoxApi;
  let db: Db;
  let patient: Patient;
  let user: User;
  let homeClinicId: string;
  const log = jest.fn();
  const logger = { log };
  const userRole = 'physician';

  beforeEach(async () => {
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
      firstName: 'Daenerys',
      lastName: 'Targaryen',
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

      const result = await graphql(schema, query, null, { db, userId: user.id, userRole, logger });
      expect(cloneDeep(result.data!.patient)).toMatchObject({
        id: patient.id,
        firstName: 'dan',
        lastName: 'plant',
      });
      expect(log).toBeCalled();
    });
  });

  describe('patientEdit', () => {
    it('edits patient', async () => {
      const query = `mutation {
        patientEdit(input: { patientId: "${patient.id}", firstName: "first" }) {
          id, firstName
        }
      }`;

      const result = await graphql(schema, query, null, { db, userRole, logger });
      expect(cloneDeep(result.data!.patientEdit)).toMatchObject({
        id: patient.id,
        firstName: 'first',
      });
      expect(log).toBeCalled();
    });
  });

  describe('patientSetup', () => {
    it('sets up patient', async () => {
      const query = `mutation {
        patientSetup(input: {
          firstName: "first",
          lastName: "last",
          gender: "F",
          zip: "02345",
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
        logger,
      });
      expect(cloneDeep(result.data!.patientSetup)).toMatchObject({
        firstName: 'first',
        lastName: 'last',
        gender: 'F',
        zip: '02345',
        dateOfBirth: '02/02/1902',
      });
      expect(log).toBeCalled();
    });

    it('errors and does not create patient when redox fails', async () => {
      const patientCount = await Patient.query().count();

      const query = `mutation {
        patientSetup(input: {
          firstName: "first",
          lastName: "last",
          gender: "F",
          zip: "02345",
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
        logger,
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
        logger,
      });
      expect(cloneDeep(result.data!.patientScratchPadEdit)).toMatchObject({
        text: 'Edited Scratch Pad',
      });
    });
  });

  describe('patient search', () => {
    beforeEach(async () => {
      const user2 = await User.create({
        firstName: 'Ygritte',
        lastName: 'of the  North',
        email: 'ygritte@beyondthewall.com',
        userRole,
        homeClinicId,
      });
      await createPatient(createMockPatient(11, homeClinicId, 'Jon', 'Snow'), user.id);
      await createPatient(createMockPatient(12, homeClinicId, 'Robb', 'Stark'), user2.id);
      await createPatient(createMockPatient(13, homeClinicId, 'Arya', 'Stark'), user.id);
      await createPatient(createMockPatient(14, homeClinicId, 'Sansa', 'Stark'), user.id);
    });

    it('searches for a single patients', async () => {
      const query = `{
        patientSearch(query: "jon", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('searches for multiple patients', async () => {
      const query = `{
        patientSearch(query: "stark", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              lastName: 'Stark',
              userCareTeam: true,
            },
          },
          {
            node: {
              lastName: 'Stark',
              userCareTeam: true,
            },
          },
          {
            node: {
              firstName: 'Robb',
              lastName: 'Stark',
              userCareTeam: false,
            },
          },
        ],
        totalCount: 3,
      });
    });

    it('fuzzy searches for a patient', async () => {
      const query = `{
        patientSearch(query: "john snow", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [
          {
            node: {
              firstName: 'Jon',
              lastName: 'Snow',
              userCareTeam: true,
            },
          },
        ],
        totalCount: 1,
      });
    });

    it('returns no search results', async () => {
      const query = `{
        patientSearch(query: "daenerys", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;
      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(cloneDeep(result.data!.patientSearch)).toMatchObject({
        edges: [],
        totalCount: 0,
      });
    });

    it('catches error if not logged in', async () => {
      const query = `{
        patientSearch(query: "daenerys", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: '',
      });

      expect(result.errors![0].message).toBe('not logged in');
    });

    it('catches error if empty string searched', async () => {
      const query = `{
        patientSearch(query: "", pageNumber: 0, pageSize: 10) {
          edges { node { firstName, lastName, userCareTeam } }
          totalCount
        }
      }`;

      const result = await graphql(schema, query, null, {
        db,
        userRole,
        userId: user.id,
      });

      expect(result.errors![0].message).toBe('Must provide a search term');
    });
  });

  describe('patient dashboard', () => {
    it('gets patients with tasks due soon or that have notifications', async () => {
      await transaction(Patient.knex(), async txn => {
        const setup = await setupUrgentTasks(txn);

        const query = `{
          patientsWithUrgentTasks(pageNumber: 0, pageSize: 10) {
            edges { node { id, firstName }}
            totalCount
          }
        }`;

        const result = await graphql(schema, query, null, {
          userRole,
          userId: setup.user.id,
          txn,
        });

        expect(result.data!.patientsWithUrgentTasks.totalCount).toBe(2);
        expect(result.data!.patientsWithUrgentTasks.edges[0].node).toMatchObject({
          id: setup.patient1.id,
          firstName: setup.patient1.firstName,
        });
        expect(result.data!.patientsWithUrgentTasks.edges[1].node).toMatchObject({
          id: setup.patient5.id,
          firstName: setup.patient5.firstName,
        });
      });
    });
  });
});
